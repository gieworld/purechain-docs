# Request node access

Anyone can run a PureChain node — but because peer discovery is **off**
(`--nodiscover`), a node cannot find the network on its own. You need a peer
provisioned for you, so node access goes through a short request.

!!! tip "Just want to read the chain or send transactions?"
    You don't need a node at all. Point your wallet or app at the public RPC
    endpoint — see [Wallets and apps](../05-reference/wallets.md).

## Where to request

<!-- TODO: replace with the node request website link -->

> **Request portal:** _link coming soon_

## What to include

- **Who you are** and a contact address.
- **What you need the node for** — app backend, indexing, redundancy, research.
- **Node type** — full, RPC, or archive.
- **Your node's enode**, once you have one (`admin.nodeInfo.enode`), or say that
  you'll supply it after first start.

## What you receive

- The **canonical `genesis.json`** and chain parameters.
- **Enode(s) to peer with**, and your node added as a static peer on the other side.
- The **pinned client release** to run.

## What's expected of you

Lightweight compared to [validator requirements](../06-join/validator-requirements.md),
but these matter:

- Run the **pinned `purechain-geth` release** — stock geth cannot follow this chain.
- Set **`--txpool.pricelimit 0`**, or your node silently refuses to relay
  zero-fee transactions.
- **Don't expose `admin`, `personal`, `debug`, or `miner` RPC publicly** — serve
  `eth,net,web3` only.
- **Don't publish the enodes you're given.** Peering details are not public.

## Next

Once approved, follow the [Quickstart](../02-run-your-own/index.md).

Thinking about validating? See [Become a validator](../06-join/index.md).
