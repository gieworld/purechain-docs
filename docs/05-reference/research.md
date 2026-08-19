# Research

PureChain's design is described in a peer-reviewed paper from the Networked
System Laboratory at **Kumoh National Institute of Technology (KIT)**, Gumi,
South Korea.

## The paper

> **The Purechain Blockchain Network: Architecture, Performance, and Applications**
> Dong-Seong Kim, Ikechi Saviour Igboanusi, George Chidera Akor
> *Blockchain: Research and Applications* (2026)
> DOI: [10.1016/j.bcra.2026.100508](https://doi.org/10.1016/j.bcra.2026.100508)

Published by Elsevier on behalf of Zhejiang University Press, open access under
[CC BY-NC-ND 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/).
Accepted 16 February 2026.

### Cite it as

```bibtex
@article{kim2026purechain,
  title   = {The Purechain Blockchain Network: Architecture, Performance, and Applications},
  author  = {Kim, Dong-Seong and Igboanusi, Ikechi Saviour and Akor, George Chidera},
  journal = {Blockchain: Research and Applications},
  year    = {2026},
  doi     = {10.1016/j.bcra.2026.100508},
  note    = {Kumoh National Institute of Technology}
}
```

## What it covers

| Topic | Where it's documented here |
|---|---|
| **SAM** — Smart Auto Mining | [Smart Auto Mining](../03-operating/sealing.md) |
| **PoA²** — Proof-of-Authority and Association | [PoA²](../03-operating/poa2.md) |
| Genesis configuration and rationale | [Genesis format](genesis-format.md) |
| Connecting wallets and tooling | [Wallets and apps](wallets.md) |

It also describes the wider platform — the Pure Series application layer, offline
transactions via QR and Bluetooth, and use cases including Pure Wallet, Pure
Voting, and Pure Media — which sit above the chain and are outside the scope of
these docs.

## Reported performance

| Metric | Value |
|---|---|
| Average throughput | ~2,300–3,000 TPS |
| Mode throughput | 2,336 TPS |
| Peak throughput | ~7,000 TPS |
| Storage saving from SAM | 25.6% (PoA), 13.7% (PoW) |

!!! note "Benchmark conditions"
        These figures come from the paper's own test methodology — simple
        value-transfer transactions at a fixed gas price with a high block gas
        limit, submitted by JSON-RPC, each test run five times with the median
        reported. They are not directly comparable to figures published for other
        chains, which use different workloads, hardware, and network sizes. The
        paper's appendices document the procedure for reproduction.

## Paper values vs the live network

The paper's Appendix A is an **illustrative** genesis, not the deployed one.
Where they differ, the live network is authoritative — see
[chain parameters](chain-params.md).

| | Paper (Appendix A) | Live network |
|---|---|---|
| Chain ID | `1990` | `900520900520` |
| RPC endpoint | `http://43.200.53.250:8548` | `https://purechainnode.com` |
| `gasLimit` | `0xffffffffffffffff` | 30,000,000 |
| Base fee | `baseFeePerGas: null` | `zeroBaseFee: true`, base fee `0` |
| `clique.period` | `1` | `1` ✓ |
| `clique.epoch` | `30000` | `30000` ✓ |

The paper's own integration section quotes the deployed chain ID
`900520900520`, matching the live network.
