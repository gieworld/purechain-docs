# What changed vs upstream

Roughly **~220 lines across 14 files** versus go-ethereum v1.13.15.

!!! info "Every change is gated"
    Each hunk is conditional on `Clique != nil`, `zeroBaseFee`, or `IsShanghai`.
    Non-Clique chains — mainnet, PoW, PoS — are **completely unaffected**. The
    same binary runs an ordinary Ethereum chain unchanged.

## The changes

| Area | Files | Summary |
|---|---|---|
| **Clique → Cancun** | `consensus/clique/clique.go`, `params/config.go`, `core/evm.go`, `miner/worker.go` | Accept & seal Shanghai/Cancun headers (no panic), enable the EVM forks for Clique, zero `PREVRANDAO` + zero `parentBeaconRoot` |
| **Free gas** | `consensus/misc/eip1559`, `core/genesis.go`, `eth/backend.go`, `internal/ethapi` | `zeroBaseFee` genesis flag pins base fee to 0; allow `--miner.gasprice 0`; accept zero-fee txs over RPC |
| **Non-merge fixes** | `eth/fetcher/block_fetcher.go`, `internal/era`, `core/txpool/blobpool` | Preserve block withdrawals on gossip/history paths that upstream assumes die at the Merge |
| **Fixes** | `core/evm.go` | Typed-nil `ChainContext` guard |

### Which parts are consensus-affecting?

The **Clique → Cancun** and **free gas** rows change block validity — they are
compiled-in consensus rules and cannot be reproduced by configuration or a
wrapper. The **non-merge fixes** are liveness/plumbing: they keep withdrawals
intact on gossip and history paths, but do not alter validity.

Note that free gas is **opt-in per chain** via the `zeroBaseFee` genesis flag,
not a hardcoded behavior.

## Why this can't be config over stock geth

1. Stock geth v1.13.15 **panics** on this chain past activation
   (`unexpected withdrawal hash value in clique`).
2. Geth **v1.14 removed Clique entirely** — no current upstream release can run
   this chain at all.
3. The Clique header rules and base-fee pinning are **compiled-in consensus
   logic**. No external process can produce them.

Because no upstream binary can validate PureChain, **the source is the trust
artifact**.

## How to verify

```bash
git diff v1.13.15..HEAD -- '*.go'
git log --oneline v1.13.15..HEAD
```

Cross-check each hunk against the repository `CHANGELOG.md`. If a
consensus-affecting hunk is not in the CHANGELOG, treat that as a documentation
bug and open an issue.

## Deeper reading

The client repository carries the full design and audit material:

| Doc | Covers |
|---|---|
| `docs/implementation-plan.md` | Full design + security rationale |
| `docs/operator-guide.md` | Build, genesis, running signer nodes |
| `docs/upgrade-runbook.md` | In-place upgrade of a live chain |
| `docs/cancun-gas-free-report.md` | Why the network stays gas-free and safe |
| `docs/upstream-backports.md` | Upstream fixes adopted after v1.13.15, and what was rejected |
