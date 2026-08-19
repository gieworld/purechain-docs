# Free gas

PureChain transactions cost **zero**. There is no base fee and no tip.

## How it works

Three pieces have to line up. Miss any one and zero-fee transactions fail in
confusing ways.

| Layer | Setting | Effect |
|---|---|---|
| **Consensus** | `"zeroBaseFee": true` in genesis | Pins the EIP-1559 base fee to 0 for every block |
| **Miner** | `--miner.gasprice 0` | Validator will include transactions paying 0 |
| **Tx pool** | `--txpool.pricelimit 0` | Pool accepts and **relays** zero-fee transactions |

!!! danger "`--txpool.pricelimit 0` is required on *every* node"
    Including non-mining RPC and relay nodes. Without it, a node's tx-pool floor
    stays at 1 wei and it will **silently drop and refuse to relay** zero-fee
    transactions received from peers. This is the single most common free-gas
    misconfiguration.

Public RPC nodes should also flatten the gas-price oracle so wallets quote 0:

```
--gpo.ignoreprice 0
--gpo.maxprice 1000000000
--gpo.percentile 0
```

## Known limitations

- **The bundled `geth` console cannot send zero-fee transactions.** Its old
  `web3.js` blocks them client-side. The node accepts them fine — use JSON-RPC
  directly, or ethers.js / web3 v4.
- **No replace-by-fee at zero price.** A pending transaction cannot be replaced
  or cancelled when all fees are 0, because the pool requires a strictly higher
  fee. Rare in practice, since blocks clear in about a second while the network is active.
- **Contract size is still 24 KB** (EIP-170). Use proxy or library patterns for
  larger contracts.

## Is free gas safe?

Free gas removes the economic cost of spam, so the protection has to come from
elsewhere. On PureChain it comes from the permissioned signer set, restricted RPC
access, the block gas limit, and per-account tx-pool limits.

**The signal to reach for fees is opening RPC more widely** — not branding.

## If fees are ever needed

Introducing a fee is **not a one-way door**. It requires no fork, no genesis
change, and no chain reset — it is pure node policy, reversible, and takes effect
on restart, per node.

Use a **minimum priority tip**, not the base fee. On every node:

```bash
--miner.gasprice <tip-wei>      # miner won't include txs paying less
--txpool.pricelimit <tip-wei>   # pool rejects txs paying less
--txpool.nolocals               # apply the floor to this node's own RPC submissions too
```

With `tip = 1000000000` (1 gwei), zero-fee transactions are rejected
(`transaction underpriced`) and a paying transaction mines with
`effectiveGasPrice == tip`. The base fee stays `0x0`, so the whole fee is the tip
and goes to the **signer** — nothing is burned. To return to free gas, set the
limits back to `0`, drop `--txpool.nolocals`, and restart.

!!! warning "Don't try this by turning off `zeroBaseFee`"
    EIP-1559's base fee is multiplicative on the parent's, so it cannot rise from
    0 by more than 1 wei per block (roughly 31 years to reach 1 gwei at 1-second
    blocks). Flipping the flag is also a consensus change requiring a coordinated
    restart — all cost, no benefit. The tip mechanism above is the supported path.
