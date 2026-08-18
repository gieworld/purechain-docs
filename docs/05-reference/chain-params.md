# Chain parameters

| Parameter | Value |
|---|---|
| Chain ID | <!-- TODO: production value --> |
| Network ID | same as chain ID |
| Consensus | Clique Proof-of-Authority |
| Block time (`clique.period`) | 5 s |
| Epoch (`clique.epoch`) | 30,000 blocks |
| Base fee | **0** (`zeroBaseFee: true`) |
| Gas limit | 30,000,000 (`0x1c9c380`) |
| EVM version | Shanghai + Cancun (from genesis) |
| Client | `purechain-geth` — go-ethereum v1.13.15 fork |
| Native token | <!-- TODO: name / symbol / decimals --> |

## Active forks

All pre-Shanghai forks activate at block `0`. Shanghai and Cancun activate by
**timestamp** (`shanghaiTime` / `cancunTime`), both `0` on a fresh chain — so the
network is Cancun from genesis.

Available: PUSH0, transient storage (`TSTORE`/`TLOAD`), EIP-4788 beacon roots,
and blob-carrying transaction plumbing.

Unchanged from Ethereum: the **24 KB contract size limit** (EIP-170).

## Node profile

The deployment runs nodes with:

```
--syncmode full --gcmode archive --snapshot=false --cache 256 --maxpeers 25
--txpool.pricelimit 0 --miner.gasprice 0
```

Public RPC nodes additionally flatten the gas-price oracle
(`--gpo.ignoreprice 0 --gpo.maxprice 1000000000 --gpo.percentile 0`) and expose
`eth,net,web3` only.

## Public endpoints

| | |
|---|---|
| RPC (HTTP) | <!-- TODO --> |
| RPC (WS) | <!-- TODO --> |
| Explorer | <!-- TODO --> |
| Faucet | <!-- TODO --> |
