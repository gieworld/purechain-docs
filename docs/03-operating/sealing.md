# On-demand sealing

By default a Clique validator runs with `--mine` and seals **continuously** —
producing empty blocks forever, even when nothing is happening. On a 1-second
chain that's 86,400 empty blocks a day.

On-demand sealing removes them: validators run **without** `--mine`, and a small
sidecar script attached over IPC starts and stops the miner based on activity.

!!! info "`eth.mining == false` while idle is correct"
    Expect the miner to be stopped during quiet periods, and gaps between blocks.
    That is the feature working, not a stalled chain.

## How it runs

The script is an infinite polling loop, attached to the node over IPC:

```bash
geth attach --exec 'loadScript("/scripts/autoMine.js")' /data/geth.ipc
```

Run it as a **background process alongside each validator** — in Docker, a
sidecar container sharing the node's data volume so it can reach `geth.ipc`:

```yaml
  automine-node1:
    image: purechain-node:<tag>
    depends_on: [node1]
    volumes:
      - ./data/node1:/data      # same volume as the node — for geth.ipc
      - ./scripts:/scripts
    entrypoint: ["geth", "attach", "--exec",
                 "loadScript(\"/scripts/autoMine.js\")", "/data/geth.ipc"]
    restart: unless-stopped
```

The node itself needs `miner`, `txpool`, and `admin` available over IPC (they are
by default) and its etherbase unlocked.

## The sealing rule

Each poll, start the miner if **any** of these holds; otherwise stop it:

| | Signal | Meaning |
|:-:|---|---|
| **a** | `txpool.status.pending > 0` | This node has ready work |
| **b** | `txpool.status.queued > 0` | This node has nonce-gapped work that will become ready |
| **c** | A block within the last *N* seconds carried transactions | The **network** is active |

!!! danger "Signal (c) is not optional — without it the chain deadlocks"
    A naive implementation triggers on local `pending` alone. Under load,
    transactions propagate with nonce gaps, so a validator briefly sees
    `pending == 0` (its copies are in `queued`) and stops sealing.

    When enough validators do that at once, the number actively sealing drops
    below Clique's `floor(N/2) + 1`, every remaining sealer hits *"signed
    recently, must wait for others"*, and **block production stops**.

    Signal (c) is derived from the chain, so every validator observes it
    identically and they stay in the sealer set together. Keep an idle window
    long enough to cover propagation — a few seconds at minimum.

When traffic genuinely stops, blocks stop carrying transactions, every validator
independently sees the same quiet chain, and they all stand down together.

## Recommended extras

- **A stall watchdog.** If ready work exists but the head hasn't advanced for a
  while, log it and nudge the miner (stop, then start). Only count that timer
  while work is actually pending — otherwise it false-fires on the first burst
  after any quiet period.
- **Set etherbase and gas price on startup**, so the sidecar is self-sufficient
  after a restart: `miner.setEtherbase(...)`, `miner.setGasPrice(0)`.

A reference implementation ships with the client repository as
`rehearsal/scripts/autoMine-v2.js`.

## Operating notes

- After a restart the sidecar reattaches, but you still need the
  [strict relay check](operations.md#after-every-restart).
- **Freeze the sidecar before testing whether your node relays** — otherwise your
  node passes the check by mining its own transaction.
- If your validator stays idle while others are sealing, investigate peering and
  transaction-pool state.
- Keep the sidecar script and config in version control alongside your node config.

## Consequences for applications

Block intervals are **not** fixed. Anything that polls for new blocks, or times
out waiting for one, must tolerate idle gaps — a quiet chain is healthy. See
[chain parameters](../05-reference/chain-params.md#block-production-is-on-demand).
