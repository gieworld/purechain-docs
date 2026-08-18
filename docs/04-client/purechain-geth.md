# purechain-geth

The PureChain execution client: a fork of **go-ethereum v1.13.15**, pinned to the
last upstream release that shipped Clique.

It is kept deliberately close to upstream, so the client behaves like the geth
operators already know — same CLI, same JSON-RPC, same tooling (MetaMask, ethers,
Hardhat, block explorers).

## Why the fork exists

PureChain needs a combination stock geth no longer supports: a **Clique (PoA)**
validator set running the **current EVM** (Shanghai + Cancun) **without a beacon
chain**, with optional **free gas**.

Upstream ties post-Shanghai forks to the PoS Merge and **removed Clique in
v1.14**. This fork keeps that path alive for permissioned networks.

## Scope of the change

~220 lines across 14 files, every hunk gated on `Clique != nil` / `zeroBaseFee` /
`IsShanghai`. Non-Clique chains are untouched — the same binary runs an ordinary
Ethereum chain unchanged.

See [What changed vs upstream](consensus-changes.md).

## Maintenance model

- **Pinned to v1.13.15.** Upstream deleted Clique, so there is nothing to rebase
  forward onto. This is not a divergent living fork.
- **Patch set + CHANGELOG.** Every consensus-affecting hunk is mapped.
- **Selective backports.** Upstream fixes from later releases are evaluated and
  adopted individually; see `docs/upstream-backports.md` in the client repo.

## Licensing and attribution

`purechain-geth` is a fork of [go-ethereum](https://github.com/ethereum/go-ethereum),
**not affiliated with or endorsed by** the go-ethereum project. It is licensed
**GPL-3.0 / LGPL-3.0** exactly as upstream — see `COPYING`, `COPYING.LESSER`, and
`AUTHORS` in the client repository.

## Compatibility boundary

!!! warning "Every node must run this binary and the same genesis"
    Past Shanghai/Cancun activation, stock geth cannot follow the chain. This is
    a deliberate hard-fork boundary, not a bug.

Rolling back to stock geth is only possible **before** the first
consensus-affecting fork activates. With `zeroBaseFee` set, the binding limit is
`londonBlock` — once London is crossed, patched nodes write `baseFee: 0` blocks
that stock geth rejects. After activation, recovery means restoring a
pre-upgrade datadir backup, not swapping the binary.

## Next

- [What changed vs upstream](consensus-changes.md)
- [Building from source](building-from-source.md)
- [Free gas](../01-overview/free-gas.md)
