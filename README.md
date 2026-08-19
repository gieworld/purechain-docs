# PureChain Documentation

Public documentation for **PureChain** — a Clique PoA, zero-fee (gasless)
EVM network built on a small, auditable fork of go-ethereum v1.13.15.

> **Status:** pre-launch of open source. See
> [`OPEN_SOURCE_STRATEGY.md`](./OPEN_SOURCE_STRATEGY.md) for what we're publishing,
> in what order, and why.

## What PureChain is

- **Consensus:** Clique Proof-of-Authority (Shanghai + Cancun enabled).
- **Fees:** zero base fee — transactions are gasless by design.
- **Client:** `purechain-geth`, a pinned patch set (~150 consensus-critical lines)
  on go-ethereum **v1.13.15**. Not a rebasing fork — upstream removed Clique in v1.14.
- **Ecosystem:** block explorer and faucet (separate repos).

## Documentation map

| Section | For |
|---|---|
| [Overview](./docs/01-overview/) | What PureChain is, architecture, FAQ |
| [Run a node](./docs/02-run-a-node/) | Anyone — full / RPC / archive nodes (open) |
| [Become a validator](./docs/03-become-a-validator/) | Operators applying to join the signer set (gated) |
| [The client](./docs/04-client/) | `purechain-geth` — what changed and why |
| [Network](./docs/05-network/) | Genesis, chain params, bootnodes |
| [Tooling](./docs/06-tooling/) | Explorer, faucet |
| [Contributing](./docs/CONTRIBUTING.md) | How to help |

## Building the docs locally

This site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

```bash
pip install -r requirements.txt
mkdocs serve      # live preview at http://127.0.0.1:8000
mkdocs build      # output to ./site
```

Contributors only need to edit Markdown files under `docs/`. New pages must be
added to the `nav:` section of `mkdocs.yml`. Deployment to GitHub Pages is
automated via `.github/workflows/docs.yml` on push to `main`.

## The public network

| | |
|---|---|
| RPC | `https://purechainnode.com` |
| Chain ID | `900520900520` |
| Symbol | `PCN` |
| Explorer | https://purechain-explorer.onrender.com/ |
| Faucet | https://purechain-faucet-frontend.onrender.com/ |

## Quick links

- Docs site: https://gieworld.github.io/purechain-docs/
- Client (`purechain-geth`): _TBD_
- Network setup: _TBD_

## Licence

**To be announced.** No licence is granted at this time — all rights reserved
pending a licensing decision. This documentation is published for reference
during the pre-release period.

The `purechain-geth` client is a fork of
[go-ethereum](https://github.com/ethereum/go-ethereum) and is licensed
GPL-3.0 / LGPL-3.0 as upstream.
