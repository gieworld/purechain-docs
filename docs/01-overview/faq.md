# FAQ

**Can I run my own PureChain network?**
Yes — that's the main use case. The client and network setup are open source, so
you can run your own permissioned, free-gas chain with your own chain ID and
validators. See [Run your own network](../02-run-your-own/index.md).

**Do I need permission to run my own network?**
No. It's GPL/LGPL-licensed software — clone it, generate a genesis, run it. The
request process below applies only to joining *the public network we operate*.

**Is PureChain really free?**
Yes. There is no base fee and no tip — transactions cost zero. See
[Free gas](free-gas.md).

**Will it stay free?**
That's the design. But it isn't a one-way door: a minimum priority tip can be
introduced at any time with no fork, no genesis change, and no chain reset — and
reversed the same way. See [if fees are ever needed](free-gas.md#if-fees-are-ever-needed).

**If gas is free, what stops spam?**
The permissioned signer set, restricted RPC access, the block gas limit, and
per-account tx-pool limits. Free gas is safe as long as RPC access stays
controlled — widening RPC is the signal to consider a tip.

**Can I join the public network instead of running my own?**
Yes, by request — peer discovery is off, so peering has to be provisioned for
you. See [Request node access](../06-join/node-access.md). To validate on the
public network, read the [requirements](../06-join/validator-requirements.md)
first; existing signers vote candidates in.

**How many validators do I need for my own network?**
One works for local development. Four or five is a sensible production floor —
Clique halts when a majority is unavailable, and there's no slashing, so liveness
is purely operational. See [the sizing table](../02-run-your-own/index.md#how-big-should-the-validator-set-be).

**Do I need a node just to use the chain?**
No. Point your wallet or app at the public RPC endpoint. See
[Wallets and apps](../05-reference/wallets.md).

**Why not just use stock geth?**
It can't run this chain. Stock v1.13.15 panics past the fork boundary, and v1.14
removed Clique entirely. See [The client](../04-client/purechain-geth.md).

**Why pinned to v1.13.15 forever?**
It's the last upstream release that shipped Clique. There is nothing to rebase
onto, so we maintain a small patch set on the pinned tag and backport upstream
fixes selectively.

**Does the fork change how normal Ethereum chains behave?**
No. Every patch is gated on `Clique != nil` / `zeroBaseFee` / `IsShanghai`. The
same binary runs mainnet unchanged.

**Do my existing tools work?**
Yes — MetaMask, ethers, Hardhat, and block explorers all work. One exception: the
`geth` console's bundled `web3.js` refuses zero-fee transactions client-side. Use
JSON-RPC or ethers instead. See [Wallets and apps](../05-reference/wallets.md).

**Can I deploy large contracts?**
The 24 KB contract size limit (EIP-170) still applies — free gas doesn't change
it. Use proxy or library patterns.
