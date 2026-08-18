# 2. Create the genesis

The genesis file defines your chain: its ID, its initial validator set, when
forks activate, and whether gas is free.

## Generate it

Never hand-craft `extradata` — the byte counts must be exact. Use the generator:

```bash
bash network/gen-genesis.sh <chainId> <signer1> [signer2 ...] > genesis.json
```

Example, a four-signer network:

```bash
bash network/gen-genesis.sh 424242 \
  0xAbc...01 0xDef...02 0x123...03 0x456...04 > genesis.json
```

The script builds the Clique `extradata` layout correctly (32-byte vanity +
20 bytes per signer + 65-byte seal) and prefunds every signer.

!!! warning "On Windows, generate inside WSL"
    PowerShell redirects produce UTF-16 files, which geth rejects.

## What you get

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
  "extradata": "0x...",
  "alloc": { }
}
```

| Field | Meaning | Change it? |
|---|---|---|
| `chainId` | Your network's ID | **Yes** — pick your own |
| `zeroBaseFee` | **The free-gas switch** | Only if you want fees |
| `clique.period` | Block time in seconds | Optional — 5 is a good default |
| `clique.epoch` | Checkpoint interval in blocks | Rarely |
| `gasLimit` | `0x1c9c380` = 30,000,000 | If you need bigger blocks |
| `shanghaiTime` / `cancunTime` | `0` = Cancun from genesis | Rarely |
| `extradata` | Encodes the initial signer set | **Never by hand** |
| `alloc` | Prefunded accounts | Add yours |

## Prefunding accounts

Even on a free-gas chain you need balances for value transfers. Add them to
`alloc`:

```json
"alloc": {
  "0xYourAddress": { "balance": "1000000000000000000000" }
}
```

The generator prefunds signers automatically. It also includes the EIP-4788
beacon-roots contract at `0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02` so Cancun
matches mainnet semantics.

## Bigger blocks

Raising `gasLimit` in genesis is not enough — also pass `--miner.gaslimit` to
your validators, or they'll converge back down to the default target.

## Distribute it

**Every node must use the byte-identical `genesis.json`.** Distribute the file
itself, not instructions for regenerating it — a regenerated file can differ and
will produce a different genesis hash, and those nodes simply won't join.

## Next

[Start validators →](validators.md)
