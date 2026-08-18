# Contributing

Thanks for helping improve PureChain.

## Where things live
- **Docs** (this repo): overview, run-a-node, validator, client, network, tooling.
- **Client** `purechain-geth`: pinned patch set on go-ethereum v1.13.15.
- **Network setup**: genesis, configs, compose. _(repo TBD)_
- **Explorer / Faucet**: separate repos.

## Docs contributions
- Keep the `<!-- TODO -->` markers until a value is verified against a running node.
- Don't invent chain params — leave `<TBD>` rather than guessing.
- Never commit secrets, private keys, or internal-only IPs/endpoints.

## Client contributions
- The fork is intentionally minimal. Consensus-affecting changes must be mapped in
  the CHANGELOG and reflected in [consensus-changes](./04-client/consensus-changes.md).
- Do not attempt to rebase onto geth ≥ v1.14 — Clique was removed upstream.

## Reporting security issues
See `SECURITY.md` (TBD). Do not open public issues for vulnerabilities.
