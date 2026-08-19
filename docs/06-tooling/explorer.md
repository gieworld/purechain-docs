# Block explorer

Browse blocks, transactions, addresses, and contracts on the public network.

**[purechain-explorer.onrender.com](https://purechain-explorer.onrender.com/)**

!!! tip "Expect gaps between blocks"
    Sealing pauses while the network is idle, so block timestamps are not evenly
    spaced. A quiet period is normal — see
    [On-demand sealing](../03-operating/sealing.md).

## An explorer for your own network

If you're [running your own network](../02-run-your-own/index.md), any
EVM-compatible explorer works — PureChain speaks standard JSON-RPC, so nothing
chain-specific is required. [Blockscout](https://github.com/blockscout/blockscout)
is the usual open-source choice.

Two things to get right:

- **Point it at an archive RPC node.** Most explorers need full history, so your
  RPC nodes must run `--gcmode archive`.
- **Expect gaps between blocks.** Explorers that assume a fixed block interval
  may report the chain as stalled during idle periods. It isn't.
