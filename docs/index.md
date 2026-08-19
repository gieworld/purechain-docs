# PureChain

A **permissioned, free-gas EVM network**. Transactions cost **zero** — no base
fee, no tip — and blocks are produced by a known set of validators.

Built on a small, auditable fork of go-ethereum **v1.13.15** that keeps **Clique
PoA** running on the **current EVM** (Shanghai + Cancun) — a combination stock
geth no longer supports.

<div class="grid cards" markdown>

-   :material-rocket-launch: **Run your own network**

    The main path. Spin up your own permissioned, free-gas chain with your own
    validators. **[Start here →](02-run-your-own/index.md)**

-   :material-help-circle: **Understand it first**

    [What is PureChain](01-overview/what-is-purechain.md) ·
    [Free gas](01-overview/free-gas.md) ·
    [FAQ](01-overview/faq.md)

-   :material-git: **The client**

    [Download a release](04-client/download.md), or read why the fork exists and
    [what changed vs upstream](04-client/consensus-changes.md).

-   :material-account-group: **Join the public network**

    Prefer to use the network we operate? [Request node access or apply to
    validate](06-join/index.md).

</div>

## At a glance

| | |
|---|---|
| **Consensus** | Clique Proof-of-Authority |
| **EVM** | Shanghai + Cancun — PUSH0, transient storage, EIP-4788 |
| **Fees** | Zero — no base fee, no tip |
| **Block time** | ~1 s while active; sealing pauses when idle |
| **Client** | `purechain-geth`, a patch set on go-ethereum v1.13.15 |
| **Tooling** | MetaMask, ethers, Hardhat, block explorers — all work unmodified |

## Connect to the public network

| | |
|---|---|
| RPC | `https://purechainnode.com` |
| Chain ID | `900520900520` |
| Symbol | `PCN` |
| Explorer | [purechain-explorer.onrender.com](https://purechain-explorer.onrender.com/) |
| Faucet | [purechain-faucet-frontend.onrender.com](https://purechain-faucet-frontend.onrender.com/) |

[Add it to MetaMask →](05-reference/wallets.md)

## Why this exists

Upstream geth ties post-Shanghai forks to the PoS Merge and **removed Clique in
v1.14**. If you want a permissioned PoA chain on a current EVM, there is no
upstream release that will do it.

PureChain is ~220 lines across 14 files versus stock geth, every change gated so
non-Clique chains behave identically. The same binary runs Ethereum mainnet
unchanged.

!!! danger "Running nodes? Set `--txpool.pricelimit 0`"
    On **every** node, mining or not. Without it a node silently drops and
    refuses to relay zero-fee transactions. It's the most common
    misconfiguration — see [Free gas](01-overview/free-gas.md).
