# Troubleshooting

## Node panics on startup or at the fork boundary

```
unexpected withdrawal hash value in clique
unexpected excess blob gas value in clique
```

You are running **stock geth**, not `purechain-geth`. Stock geth cannot validate
this chain past Shanghai/Cancun activation — this is a deliberate hard-fork
boundary, not a bug. Install `purechain-geth`; see
[Building from source](../04-client/building-from-source.md).

## Zero-fee transactions are rejected or never propagate

Almost always **`--txpool.pricelimit 0` is missing** on some node. Without it the
pool floor stays at 1 wei and the node silently drops and refuses to relay
zero-fee transactions from peers — even if it is not mining.

Set it on **every** node in the network. See [Free gas](../01-overview/free-gas.md).

## A node accepts transactions but they never get mined

Expected after any restart: a restarted node accepts transactions over RPC but
does not relay them to peers until a sync re-arms it.

Verify by submitting a transaction through that node and confirming a *different*
node mines it. If your node is a validator, freeze its miner first — otherwise it
passes the test by mining its own transaction.

## `eth_gasPrice` returns non-zero / wallet overpays

Add the gas-price oracle flags to public RPC nodes:

```
--gpo.ignoreprice 0 --gpo.maxprice 1000000000 --gpo.percentile 0
```

## The `geth` console won't send a zero-fee transaction

Expected. The console's bundled `web3.js` blocks it **client-side** — the node
accepts it fine. Use JSON-RPC directly or ethers.js / web3 v4. See
[Connecting wallets and apps](../05-reference/wallets.md).

## A pending transaction can't be cancelled or replaced

Expected at zero fee. Replace-by-fee requires a strictly higher fee, which is
impossible when everything is 0. Transactions normally clear within a second or two while the network is active.

## No peers

- Discovery is **off** on this network — a node cannot find peers on its own.
  Confirm your static peers were added and took effect (`admin.peers.length > 0`);
  `addPeer` can silently no-op if called too early. See [Peering](../05-reference/peering.md).
- Confirm `--networkid` matches the chain ID in genesis.
- Check the firewall on the P2P port (default 30303).

## Wrong genesis / fork mismatch

Re-`init` with the official `genesis.json`. Never hand-edit fork activation
values — they must match the rest of the network exactly, or you will fork off.

!!! danger "Never use `debug.setHead` on this network"
    In-place rewinds can fork a Clique chain. If a node is bad, resync it from
    genesis instead.
