# Architecture

<!-- TODO: diagram — validators (private), public RPC nodes, explorer, faucet -->

## Components
- **purechain-geth** — the execution client (Clique PoA, zero-fee). Pinned to v1.13.15.
- **Peering** — discovery is **off** (`--nodiscover`); nodes are statically
  peered. See [Peering](../05-reference/peering.md).
- **Signer set** — the Clique validators that produce and seal blocks.
- **Explorer** — block/tx explorer (separate repo).
- **Faucet** — dispenses the native token for onboarding (separate repo).

## Consensus at a glance
- Clique PoA: blocks signed in round-robin by the authorized signer set.
- Signers added/removed by majority vote of current signers (`clique_propose`).
- No slashing — the admission gate is the safety mechanism.
- Shanghai + Cancun EVM features enabled; base fee pinned to 0.
