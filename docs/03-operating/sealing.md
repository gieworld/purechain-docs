# Smart Auto Mining (SAM)

**Smart Auto Mining (SAM)** is PureChain's sealing policy: mining activates only
when there are transactions to process, and pauses when the network is idle.

It is one of the two core innovations described in the Purechain paper — see
[Research](../05-reference/research.md).

## Why it exists

A standard Clique validator runs with `--mine` and seals **continuously**,
producing empty blocks whether or not anything is happening. On a one-second
chain that is 86,400 empty blocks a day.

Measured over a 12-hour run with 599,950 transactions:

| | Blocks produced | Storage |
|---|---:|---:|
| Standard PoA (continuous) | 4,934 extra empty blocks with **no new transactions** | 112.2 MB |
| PoA with SAM | 1,022 blocks total | 83.5 MB |

That is a **25.6% storage saving** on PoA (13.7% on PoW), plus proportionally
lower energy use, network traffic, and disk I/O.

!!! info "`eth.mining == false` while idle is correct"
    Expect the miner stopped during quiet periods and gaps between blocks. That
    is SAM working, not a stalled chain.

## The cycle

1. **Transaction Listener** — each miner node monitors the transaction pool.
2. **Miner Activation** — pending transactions detected, start sealing.
3. **Continuous Mining** — keep sealing while transactions remain pending.
4. **Empty-block tail** — after the queue clears, append a small configurable
   number of empty blocks (**K**) before stopping.
5. **Miner Deactivation** — pause sealing; the listener keeps watching.

### The empty-block tail is not waste

Step 4 is deliberate. Those few empty blocks give the just-mined transactions
**confirmation depth** and protect against attacks that target a chain tip which
stops moving the instant the last transaction lands. `K` is configurable per
deployment — record the value you use.

## Running it

SAM runs as a script attached to the node over IPC, **not** as a client flag.
Validators run without `--mine`.

```bash
geth attach --exec 'loadScript("/scripts/autoMine.js")' /data/geth.ipc
```

In Docker, a sidecar container sharing the node's data volume:

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

The node needs `miner`, `txpool`, and `admin` over IPC (default) and its
etherbase unlocked. A reference implementation ships with the client repository
as `rehearsal/scripts/autoMine-v2.js`.

## Implementing the trigger correctly

The paper's algorithm activates on **pending transactions detected**. A direct
reading — trigger on this node's local `pending` only — deadlocks a multi-validator
network under load, so production adds two more signals:

| | Signal | Meaning |
|:-:|---|---|
| **a** | `txpool.status.pending > 0` | This node has ready work |
| **b** | `txpool.status.queued > 0` | Nonce-gapped work that will become ready |
| **c** | A block within the last *N* seconds carried transactions | The **network** is active |

!!! danger "Signal (c) is what prevents a deadlock"
    Under load, transactions propagate with nonce gaps, so a validator briefly
    sees `pending == 0` (its copies sit in `queued`) and stops sealing. When
    enough validators do that simultaneously, the number actively sealing falls
    below Clique's `floor(n/2) + 1`, every remaining sealer hits *"signed
    recently, must wait for others"*, and **block production stops**.

    Signal (c) is read from the chain, so all validators observe it identically
    and stay in the sealer set together. Keep the idle window comfortably longer
    than propagation time.

### Also recommended

- **A stall watchdog** — if ready work exists but the head hasn't advanced,
  log it and nudge the miner. Only run that timer while work is pending, or it
  false-fires on the first burst after a quiet period.
- **Set etherbase and gas price on startup** so the sidecar is self-sufficient
  after a restart.

## Operating notes

- After a restart the sidecar reattaches, but still run the
  [strict relay check](operations.md#after-every-restart).
- **Freeze the sidecar before testing whether your node relays** — otherwise it
  passes by mining its own transaction.
- If your validator stays idle while others seal, check peering and pool state.
- Keep the script and its parameters in version control with your node config.

## Consequences for applications

Block intervals are **not** fixed. Anything polling for blocks, or timing out
waiting for one, must tolerate idle gaps. See
[chain parameters](../05-reference/chain-params.md#block-production-is-on-demand).
