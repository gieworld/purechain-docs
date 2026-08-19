# Chain parameters

Live values for the public PureChain network.

## Connect

| | |
|---|---|
| **RPC (HTTP)** | `https://purechainnode.com` |
| **Chain ID** | `900520900520` (`0xd1ab3a77a8`) |
| **Network ID** | `900520900520` |
| **Currency symbol** | `PCN` |
| **Decimals** | 18 |
| **Block explorer** | [purechain-explorer.onrender.com](https://purechain-explorer.onrender.com/) |
| **Faucet** | [purechain-faucet-frontend.onrender.com](https://purechain-faucet-frontend.onrender.com/) |

See [Wallets and apps](wallets.md) to add the network to MetaMask.

## Consensus and execution

| Parameter | Value |
|---|---|
| Consensus | Clique Proof-of-Authority |
| Block time (`clique.period`) | **1 s while active** — see below |
| Base fee | **0** (`zeroBaseFee: true`) |
| `eth_gasPrice` | `0x0` |
| Gas limit | 30,000,000 |
| EVM version | Shanghai + Cancun |
| Client | `purechain-geth` v1.13.15-stable |

## Block production is on-demand

Blocks are produced roughly **every second while the network is active**, and
**sealing pauses when the network is idle** — so there are no empty blocks during
quiet periods, and gaps between bursts of activity are normal and expected.

Observed on the live chain: 25 consecutive blocks one second apart during
activity, and a 25-block span covering several hours across an idle period.

!!! tip "Don't assume a fixed block interval"
    If your application polls for new blocks or times out waiting for one, handle
    idle gaps. A quiet chain is healthy, not stalled. See
    [On-demand sealing](../03-operating/sealing.md).

## Active forks

All pre-Shanghai forks activate at block `0`; Shanghai and Cancun activate by
timestamp and are live from genesis. Confirmed on the live chain — blocks carry
`withdrawalsRoot` and `parentBeaconBlockRoot`.

Available: PUSH0, transient storage (`TSTORE`/`TLOAD`), EIP-4788 beacon roots,
and blob-carrying transaction plumbing.

Unchanged from Ethereum: the **24 KB contract size limit** (EIP-170).

## Node profile

Public RPC nodes run:

```
--syncmode full --gcmode archive --snapshot=false --cache 256 --maxpeers 25
--nodiscover --txpool.pricelimit 0 --miner.gasprice 0
--gpo.ignoreprice 0 --gpo.maxprice 1000000000 --gpo.percentile 0
--http.api eth,net,web3
```

<!-- TODO: publish WebSocket endpoint if one is offered -->
