# Validator operations

## Health checks

```js
clique.getSigners()   // confirm you're in the set
clique.status()       // sealing activity across recent blocks
eth.blockNumber       // confirm you're at chain head
admin.peers.length    // confirm the peer mesh
```

## After every restart

!!! danger "A restarted node stops relaying transactions until re-armed"
    It still accepts them over RPC and looks healthy — synced, peered, serving
    requests — while silently failing to pass them on. A binary upgrade is a
    restart, so this applies to every upgrade.

Run a strict relay check:

1. Freeze your automine sidecar and miner, so your node can't pass by mining its
   own transaction.
2. Submit a transaction through your node.
3. Confirm a **different** node mines it.

## Quorum and outages

Clique needs a majority of signers to make progress, and a signer that just
sealed must wait before sealing again:

| Signers | Can lose | Chain halts at |
|---:|---:|---:|
| 4 | 1 | 2 down |
| 5 | 2 | 3 down |
| 7 | 3 | 4 down |

Once quorum returns the chain resumes within seconds — but the returning signers'
miners must actually be started. A single returning signer often cannot seal
alone.

## Bring-up and restarts

- **One node at a time.** Simultaneous starts can split the network before the
  peer mesh exists. Start a node, confirm it's ready and peered, then move on.
- **Confirm all nodes agree before any sealing starts.**
- **Roll upgrades one node at a time** — RPC nodes first, then validators. After
  each: caught up → correct binary → **relay check** → chain advanced → all agree.
- **Never use `debug.setHead`.** In-place rewinds can fork the chain; resync from
  genesis instead.
- **Keep a pre-upgrade datadir backup.** Past the fork boundary, rollback is not
  a binary swap.

## Good practice

- Alert on missed sealing turns, not just on the node being down.
- Watch peer count — with discovery off, losing static peers means silent isolation.
- Keep `--txpool.pricelimit 0` set, or you stop relaying.
- Never expose admin, personal, miner, debug, or clique RPC beyond localhost.
- Stay on the pinned `purechain-geth` release.

## Leaving the set

Coordinate with governance; other signers vote you out with
`clique.propose("0x<addr>", false)`. Don't just shut down — an unannounced signer
going dark costs the network liveness margin.
