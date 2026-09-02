# PureChain Documentation

Public documentation for **PureChain** — a Clique PoA, zero-fee (gasless)
EVM network built on a small, auditable fork of go-ethereum v1.13.15.

Published at **https://gieworld.github.io/purechain-docs/**

## What PureChain is

- **Consensus:** Clique Proof-of-Authority (Shanghai + Cancun enabled).
- **Fees:** zero base fee — transactions are gasless by design.
- **Client:** `purechain-geth`, a pinned patch set (~220 lines across 14 files)
  on go-ethereum **v1.13.15**. Not a rebasing fork — upstream removed Clique in v1.14.
- **Ecosystem:** block explorer and faucet (separate repos).

## Documentation map

| Section | For |
|---|---|
| [Overview](./docs/01-overview/) | What PureChain is, architecture, free gas, FAQ |
| [Run your own network](./docs/02-run-your-own/) | Genesis, validators, RPC nodes, Docker, production checklist |
| [Operating a network](./docs/03-operating/) | Operations, SAM, PoA², troubleshooting |
| [The client](./docs/04-client/) | `purechain-geth` — download, what changed, building |
| [Reference](./docs/05-reference/) | Chain parameters, genesis format, peering, wallets, research |
| [Tooling](./docs/06-tooling/) | Explorer, faucet |
| [Join the public network](./docs/06-join/) | Node access, validator requirements and application |
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
- Client (`purechain-geth`): https://github.com/gieworld/purechain_testnet
- Releases (prebuilt binaries): https://github.com/gieworld/purechain_testnet/releases
- Genesis generator: `network/gen-genesis.sh` in the client repository

## Licence

This documentation is licensed **CC BY 4.0** — see [`LICENSE`](./LICENSE).
Share and adapt it freely, including commercially, with attribution. Embedded
code samples may be used without attribution.

Related work carries different licences, and the boundaries are deliberate:

| Work | Licence |
|---|---|
| This documentation | CC BY 4.0, © PureChain |
| This repo's own code — chat widget and chatbot backend | **MIT, © PureChain** ([`LICENSE-CODE`](./LICENSE-CODE)) |
| The `purechain-geth` client | **LGPL-3.0** outside `cmd/`, **GPL-3.0** inside `cmd/` — inherited from [go-ethereum](https://github.com/ethereum/go-ethereum) and not ours to change |
| SAM and PoA² sidecar scripts | **Apache-2.0, © PureChain** (`LICENSE-purechain` in the client repository) — JavaScript run *by* geth's console, not derivative works of it |
