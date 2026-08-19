# What is PureChain?

PureChain is a **permissioned, free-gas EVM network**. Transactions cost
**zero** — there is no base fee and no tip — and blocks are produced by a known
set of validators rather than by open mining or staking.

It runs on `purechain-geth`, a fork of **go-ethereum v1.13.15** kept deliberately
close to upstream, so the client behaves like the geth operators already know:
same CLI, same JSON-RPC, same tooling (MetaMask, ethers, Hardhat, block explorers).

## Design goals

- **Free gas.** `zeroBaseFee` pins the base fee to 0; the miner and tx-pool
  floors are set to 0. Users transact without holding a fee token.
- **Current EVM.** Shanghai and Cancun are active — PUSH0, transient storage,
  EIP-4788, blob-carrying transaction plumbing.
- **Auditability.** ~220 lines across 14 files versus upstream, every hunk gated
  so non-PureChain chains behave identically.
- **Resource efficiency.** [Smart Auto Mining (SAM)](../03-operating/sealing.md)
  seals only when there are transactions to process, cutting the empty blocks a
  continuously-mining PoA chain would otherwise produce.
- **Validator reliability.** [PoA²](../03-operating/poa2.md) monitors signer
  activity and automatically replaces inactive validators with pre-vetted
  standbys.
- **Permissioned participation.** Peer discovery is off, so every participant is
  provisioned deliberately. Anyone may request a node; validators additionally
  meet a published bar and are voted in by the existing signers.

## The two core innovations

PureChain's design is published in a peer-reviewed paper from Kumoh National
Institute of Technology — see [Research](../05-reference/research.md).

| | What it does |
|---|---|
| **SAM** — Smart Auto Mining | Activates mining only when transactions are pending; pauses when idle. Measured 25.6% storage saving on PoA. |
| **PoA²** — Proof-of-Authority and Association | Monitors sealer activity over 64-block windows and automatically votes out inactive signers, replacing them from a standby pool. |

Both run **on top of** stock Clique using standard RPC — neither requires a
consensus change, and neither is part of the client fork.

## Why a fork exists

PureChain needs a combination stock geth no longer supports: a
**Proof-of-Authority (Clique)** validator set running the **current EVM**, with
zero-cost transactions. Upstream ties post-Shanghai forks to the PoS Merge and
**dropped Clique entirely in v1.14** — so this fork keeps that path alive.

Every patch is gated on `Clique != nil` / `zeroBaseFee` / `IsShanghai`. Point the
same binary at Ethereum mainnet and it behaves exactly like stock geth.

See [The client](../04-client/purechain-geth.md) and
[Free gas](free-gas.md).

## The public network

| | |
|---|---|
| RPC | `https://purechainnode.com` |
| Chain ID | `900520900520` |
| Symbol | `PCN` |
| Explorer | [purechain-explorer.onrender.com](https://purechain-explorer.onrender.com/) |
| Faucet | [purechain-faucet-frontend.onrender.com](https://purechain-faucet-frontend.onrender.com/) |

You can also [run your own network](../02-run-your-own/index.md) — that's the
main path through these docs.

## Safety model

Free gas means there is **no economic cost to spam**. Protection comes from:

1. the **permissioned signer set** (only known validators produce blocks),
2. **restricted RPC access**,
3. the **block gas limit** and per-account tx-pool limits.

Fees are not a one-way door — a minimum priority tip can be introduced at any
time with no fork and no chain reset. See [Free gas](free-gas.md#if-fees-are-ever-needed).

<!-- TODO: launch date -->
