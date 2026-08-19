# Research

PureChain comes out of the Networked System Laboratory and the ICT Convergence
Research Center at **Kumoh National Institute of Technology (KIT)**, Gumi, South
Korea, and is described across a body of peer-reviewed work.

---

## Foundations

The papers that define PureChain and its mechanisms.

### The network

> **The Purechain Blockchain Network: Architecture, Performance, and Applications**
> Dong-Seong Kim, Ikechi Saviour Igboanusi, George Chidera Akor
> *Blockchain: Research and Applications* (2026)
> DOI: [10.1016/j.bcra.2026.100508](https://doi.org/10.1016/j.bcra.2026.100508)

The reference description of the network: PoA², SAM, genesis configuration,
performance evaluation, and use cases. Open access under
[CC BY-NC-ND 4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/).

### Smart Auto Mining

> **Smart auto mining (SAM) for industrial IoT blockchain network**
> Ikechi Saviour Igboanusi, Allwinnaldo, Revin Naufal Alief,
> Muhammad Rasyid Redha Ansori, Jae-Min Lee, Dong-Seong Kim
> *IET Communications* (2022)
> DOI: [10.1049/cmu2.12465](https://doi.org/10.1049/cmu2.12465)

The primary source for [SAM](../03-operating/sealing.md). Reports a private
Ethereum network producing over 300% more blocks without SAM across a 12-hour,
599,950-transaction run, and a ~14% reduction in chaindata storage.

### PoA² consensus

> **Proof-of-Authority-and-Association Consensus Algorithm for IoT Blockchain Networks**
> Dong-Seong Kim, Ikechi Saviour Igboanusi, Love Ahakonye, Gabriel O. Anyanwu *et al.*
> *2025 IEEE International Conference on Consumer Electronics (ICCE)*, pp. 1–6

The primary source for [PoA²](../03-operating/poa2.md) and its redundancy-based
validator management.

### Also foundational

<!-- TODO: confirm full citations (authors, year, volume/pages, DOI) with the lab -->

- **The Purechain Blockchain Network: An Overview**
- **Blockchain-as-a-Service: A Pure Chain Approach** —
  [*Blockchain: Research and Applications*](https://www.sciencedirect.com/science/article/pii/S2096720925001241)
- **PureQuantum: Towards a Scalable Blockchain Channel Security in IoT Networks** —
  [*Blockchain: Research and Applications*](https://www.sciencedirect.com/science/article/pii/S2096720925000995)

---

## Implementations

Systems and applications built on PureChain.

<!-- TODO: confirm full citations and add any missing work -->

| Work | Domain | Venue |
|---|---|---|
| **Pure Wallet (PW)** — offline transaction architecture | Offline payments via NFC / QR / Bluetooth | *ICT Express* 7(3), 327–334 (2021) |
| **Pure Voting (PV)** — an offline voting algorithm | Secure, accessible e-voting | *APCC 2022*, 586–587 |
| **HADES** — hash-based audio copy detection | Copyright protection for decentralized music sharing (Pure Media) | *IEEE Trans. Network and Service Management* 20(3), 2845–2853 (2023) |
| **PureFed** | Collaborative, trustworthy federated learning | — |
| **PureTrust** | Soulbound-token trust management for V2X networks | — |
| **ProtChain** | Biomedical workflows with decentralized storage | — |
| **BOMS** | Blockchain organ matching system | — |
| **Impact of PureChain for Secure and Scalable Cybersecurity** | Resource-constrained IIoT | — |

These sit **above** the chain. None of them are required to run a node or a
network — they're evidence of what the platform has been used for.

---

## Citing the network paper

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

## What maps to these docs

| Topic | Documented here |
|---|---|
| SAM — Smart Auto Mining | [Smart Auto Mining](../03-operating/sealing.md) |
| PoA² — Proof-of-Authority and Association | [PoA²](../03-operating/poa2.md) |
| Genesis configuration and rationale | [Genesis format](genesis-format.md) |
| Connecting wallets and tooling | [Wallets and apps](wallets.md) |

## Reported performance

| Metric | Value |
|---|---|
| Average throughput | ~2,300–3,000 TPS |
| Mode throughput | 2,336 TPS |
| Peak throughput | ~7,000 TPS |
| Storage saving from SAM | 25.6% (PoA), 13.7% (PoW) |

!!! note "Benchmark conditions"
    These come from the paper's own methodology — simple value-transfer
    transactions at a fixed gas price with a high block gas limit, submitted by
    JSON-RPC, each test run five times with the median reported. They are not
    directly comparable to figures published for other chains, which use
    different workloads, hardware, and network sizes. The paper's appendices
    document the procedure for reproduction.

## Paper values vs the live network

The network paper's Appendix A is an **illustrative** genesis, not the deployed
one. Where they differ, the live network is authoritative — see
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
