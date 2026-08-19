# Faucet

Get **PCN**, the native token of the public PureChain network.

**[purechain-faucet-frontend.onrender.com](https://purechain-faucet-frontend.onrender.com/)**

<!-- TODO: link the faucet's source repo once public; document rate limits -->

## Why a faucet on a free-gas chain?

Gas is free, so you don't need PCN to *send* a transaction. You need it for
**value transfers** and for contracts that move balances.

That's the useful distinction: on PureChain an empty account can already transact
— deploy a contract, call a method — without holding anything. The faucet is for
when you need a balance, not for when you need gas.

## Running your own

If you're [running your own network](../02-run-your-own/index.md), prefund the
accounts you need directly in genesis `alloc` rather than standing up a faucet.
See [Create the genesis](../02-run-your-own/genesis.md#prefunding-accounts).
