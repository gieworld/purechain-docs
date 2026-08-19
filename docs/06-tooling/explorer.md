# Block explorer

Browse blocks, transactions, addresses, and contracts on the public network.

**[purechain-explorer.onrender.com](https://purechain-explorer.onrender.com/)**

<!-- TODO: link the explorer's source repo once public -->

!!! tip "Expect gaps between blocks"
    Sealing pauses while the network is idle, so block timestamps are not evenly
    spaced. A quiet period is normal — see
    [On-demand sealing](../03-operating/sealing.md).

## Running your own

If you're [running your own network](../02-run-your-own/index.md), you'll want
your own explorer instance pointed at your RPC nodes. Your RPC nodes must run
`--gcmode archive` — most explorers need full history.

<!-- TODO: self-hosting instructions -->
