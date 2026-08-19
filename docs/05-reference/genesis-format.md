# Genesis

## The production genesis

<!-- TODO: publish the canonical production genesis.json and its hash here.
     Network parameters (chainId, signers, activation times) are provisioned
     per deployment and are deliberately not hardcoded in the client. -->

## Shape of a PureChain genesis

```json
{
  "config": {
    "chainId": 424242,
    "homesteadBlock": 0, "eip150Block": 0, "eip155Block": 0, "eip158Block": 0,
    "byzantiumBlock": 0, "constantinopleBlock": 0, "petersburgBlock": 0,
    "istanbulBlock": 0, "berlinBlock": 0, "londonBlock": 0,
    "shanghaiTime": 0,
    "cancunTime": 0,
    "zeroBaseFee": true,
    "clique": { "period": 5, "epoch": 30000 }
  },
  "difficulty": "1",
  "gasLimit": "0x1c9c380",
  "extradata": "0x<32-byte vanity><20-byte signer each><65-byte seal>",
  "alloc": { }
}
```

!!! note "`424242` is a placeholder"
    It is the generic example chain ID used in the client repository, **not** the
    production value.

### Key fields

| Field | Meaning |
|---|---|
| `shanghaiTime` / `cancunTime` | Timestamp-based activation. `0` = Cancun from genesis |
| `zeroBaseFee` | **The free-gas switch.** Pins base fee to 0 |
| `clique.period` | Block time in seconds. The public network uses `1` |
| `clique.epoch` | Checkpoint interval in blocks (`30000`) |
| `gasLimit` | `0x1c9c380` = 30,000,000 |
| `extradata` | Encodes the **initial signer set** |
| `alloc` | Prefunded accounts + the EIP-4788 beacon-roots contract |

### EIP-4788 beacon-roots contract

A fresh genesis includes the beacon-roots contract at
`0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02` so Cancun matches mainnet semantics.
The patched client treats it as a no-op if absent, but including it is cleaner.

## Generating a genesis

Never hand-craft `extradata` — the byte counts must be exact. Use the generator:

```bash
bash network/gen-genesis.sh <chainId> <signer1> [signer2 ...] > genesis.json
```

It builds the 32-byte vanity + 20-bytes-per-signer + 65-byte seal layout
correctly and prefunds each signer.

!!! warning "Generate it inside WSL on Windows"
    PowerShell redirects produce UTF-16 files, which geth rejects.

## Upgrading an existing chain in place

Keep the original genesis params **byte-identical**, then add new fields with
**future** activation (`berlinBlock`/`londonBlock` above current head,
`shanghaiTime`/`cancunTime` in the future), and `geth init` on each node's
datadir — this updates config while preserving the chain. Upgrade every node
before activation.

!!! danger "`zeroBaseFee` and the genesis hash"
    `zeroBaseFee` affects the genesis hash **only if London is active at block 0**.
    On a fresh free-gas chain that's fine. When upgrading an existing chain,
    London activates at a *future* block, so block 0 stays pre-London and the
    genesis hash is unchanged — which is required for `geth init` to accept the
    existing data. **Do not add `zeroBaseFee` to a chain that already had London
    at genesis.**
