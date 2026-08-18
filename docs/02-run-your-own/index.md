# Run your own network

This is the main path through these docs. PureChain is open source so you can
**run your own permissioned, free-gas EVM network** — on your own hardware, with
your own validators and chain ID.

## What you'll build

A working Clique PoA network with:

- **Zero-fee transactions** — no base fee, no tip
- **Current EVM** — Shanghai + Cancun (PUSH0, transient storage, EIP-4788)
- **Your own validator set** — the signers you nominate in genesis
- **Standard tooling** — MetaMask, ethers, Hardhat, block explorers all work

## The steps

<div class="grid cards" markdown>

-   **1. [Prerequisites](prerequisites.md)**

    Hardware, Go toolchain, and the client binary.

-   **2. [Create the genesis](genesis.md)**

    Pick a chain ID, nominate signers, generate `genesis.json`.

-   **3. [Start validators](validators.md)**

    Initialize, import signer keys, bring nodes up in order.

-   **4. [Add RPC nodes](rpc-nodes.md)**

    Non-sealing nodes that serve apps and wallets.

-   **5. [Verify it works](verify.md)**

    Send a zero-fee transaction and confirm the forks are live.

-   **[Production checklist](production.md)**

    What to get right before anyone depends on it.

</div>

## Before you start

!!! danger "Three rules that cause most failures"
    1. **Every node runs the same binary and the same genesis.** Stock geth
       cannot follow the chain past Shanghai/Cancun activation.
    2. **`--txpool.pricelimit 0` on every node**, mining or not. Without it,
       nodes silently drop and refuse to relay zero-fee transactions.
    3. **Bring nodes up one at a time.** Simultaneous starts can split a Clique
       network before the peer mesh exists.

## How big should the validator set be?

Clique needs a majority of signers to make progress, and a signer that just
sealed must wait before sealing again. That makes small sets fragile:

| Signers | Can lose | Chain halts at |
|---:|---:|---:|
| 1 | 0 | any outage |
| 3 | 1 | 2 down |
| 4 | 1 | 2 down |
| 5 | 2 | 3 down |
| 7 | 3 | 4 down |

**One signer** is fine for local development. **Four or five** is a sensible
production floor. There is no slashing — liveness is entirely an operational
concern.

## Just want to try it locally?

A single-signer network on one machine works and takes about five minutes:
follow [genesis](genesis.md) with one signer address, then
[start it](validators.md). Skip the RPC nodes.
