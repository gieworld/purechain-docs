# Research

PureChain comes out of the Networked System Laboratory and the ICT Convergence
Research Center at **Kumoh National Institute of Technology (KIT)**, Gumi, South
Korea. This page collects the work that defines the chain, and the systems built
on it.

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
> Dong-Seong Kim, Ikechi Saviour Igboanusi, Love Allen Chijioke Ahakonye,
> Gabriel O. Anyanwu *et al.*
> *2025 IEEE International Conference on Consumer Electronics (ICCE)*, pp. 1–6

The primary source for [PoA²](../03-operating/poa2.md) and its redundancy-based
validator management.

### Platform and extensions

| Work | Focus | Venue |
|---|---|---|
| **The Purechain Blockchain Network: An Overview** | Platform overview | — |
| **Blockchain-as-a-Service: A Pure Chain Approach** | BaaS delivery model | [*Blockchain: Research and Applications*](https://www.sciencedirect.com/science/article/pii/S2096720925001241) |
| **PureQuantum: Towards a Scalable Blockchain Channel Security in IoT Networks** | Post-quantum channel security | [*Blockchain: Research and Applications*](https://www.sciencedirect.com/science/article/pii/S2096720925000995) |
| **PureChain DBMS: A Zero-Gas Blockchain Database Management System with Adaptive Compression** | Zero-gas storage layer | IEEE (2025) |

---

## Implementations

Systems built on PureChain, grouped by domain. These sit **above** the chain —
none are needed to run a node or a network.

### Industrial IoT security

| Work | Venue |
|---|---|
| **PureChain Closed-Loop Intrusion Detection and Real-Time Recovery for Industrial IoT**<br><small>H. Ibrahim, L. A. C. Ahakonye, J.-M. Lee, D.-S. Kim</small> | *IEEE IoT Journal* 13(11), 2026 · DOI [10.1109/JIOT.2026.3672474](https://doi.org/10.1109/JIOT.2026.3672474) |
| **A Unified AI-PureChain Framework for Verifiable Intrusion Prevention in Industrial IoT Systems**<br><small>H. Ibrahim, L. A. C. Ahakonye, J.-M. Lee, D.-S. Kim</small> | *IEEE IoT Journal* 13(7), 2026 |
| **PureChain-Based Real-Time Intrusion Detection for Secure Industrial Humanoid IIoT Communication** | 2026 |
| **Blockchain-Driven Intrusion Prevention and Runtime Assurance for Cyber-Physical Systems** | IEEE, 2026 |
| **A Decentralized Approach to Tamper-Proof SCADA Intrusion Detection and Prevention System** | KICS, 2025 |
| **Impact of PureChain for Secure and Scalable Cybersecurity in Resource-Constrained IIoT** | 2025 |

### Vehicular networks (V2X / IoV)

| Work | Venue |
|---|---|
| **PureTrust: A Soulbound Token-Based Blockchain Framework for Incentive-Driven Trust Management in V2X Networks**<br><small>H. L. Nakayiza, L. A. C. Ahakonye, D.-S. Kim, J.-M. Lee</small> | *IEEE IoT Journal* 13(7), 2026 · DOI [10.1109/JIOT.2026.3656576](https://doi.org/10.1109/JIOT.2026.3656576) |
| **ConfidSPEC-V2X: A Quantum-Blockchain Intelligence for Mitigating Confidentiality Threats in Vehicle-to-Everything Networks**<br><small>C. I. Okafor, L. A. C. Ahakonye, D.-S. Kim, J.-M. Lee</small> | *IEEE IoT Journal* 13(14), 2026 |
| **PureFL: Trust-Weighted Federated Learning With Noise-Resilient Homomorphic Encryption for Blockchain-Based IoV Networks**<br><small>H. L. Nakayiza, L. A. C. Ahakonye, D.-S. Kim, J.-M. Lee</small> | *IEEE IoT Journal* 13(14), 2026 |

### Healthcare

| Work | Venue |
|---|---|
| **RemoteCare: AI-Driven Multimodal Predictive Framework With Blockchain for Personalized Remote Patient Monitoring in IoMT**<br><small>C. A. Nnadiekwe, S. O. Ajakwe, J.-M. Lee, D.-S. Kim</small> | *IEEE IoT Journal* 13(3), 2026 |
| **ProtChain** — permissioned ledger with decentralized storage for biomedical workflows | — |
| **BOMS** — blockchain organ matching system | — |

### Smart contracts and verifiable computation

| Work | Venue |
|---|---|
| **PureChain-Enabled Framework for Trustworthy and Incentivized Smart Contract Vulnerability Detection**<br><small>M. S. Khaliq, L. A. C. Ahakonye, J.-M. Lee, D.-S. Kim</small> | *IEEE IoT Journal*, 2026 (early access) |
| **PureChain-Based Zero-Knowledge Proofs for Verifiable Machine Learning in Industrial IoT** | KICS, 2025 |
| **PureFed** — collaborative, trustworthy federated learning | — |

### Applications and traceability

| Work | Venue |
|---|---|
| **Blockchain side implementation of Pure Wallet (PW): an offline transaction architecture** | *ICT Express* 7(3), 327–334, 2021 |
| **Pure Voting (PV): An Offline Voting Algorithm** | *APCC 2022*, 586–587 |
| **HADES: Hash-based Audio Copy Detection System for Copyright Protection in Decentralized Music Sharing** | *IEEE Trans. Network and Service Management* 20(3), 2845–2853, 2023 |
| **PureChain NFT-Based Decentralized Inventory Management with Offline Capabilities** | 2025 |
| **Integrated Blockchain and Machine Learning Framework for Polystyrene Waste Traceability** | IEEE, 2026 |

!!! note "Not exhaustive"
    New work appears regularly. For the current list, see the authors' profiles
    on [Google Scholar](https://scholar.google.com/scholar?q=PureChain+blockchain)
    and [IEEE Xplore](https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=PureChain).

<!-- TODO: fill remaining venue/DOI gaps and confirm author lists with the lab -->

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
    These come from the network paper's own methodology — simple value-transfer
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
