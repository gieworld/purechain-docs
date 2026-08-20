# 1. Prerequisites

## Hardware

Per node. Archive storage grows continuously — plan headroom.

| | Development | Production |
|---|---|---|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8–16 GB |
| Disk | SSD, 20 GB | SSD, 100 GB+ |
| Network | any | stable, static addressing |

Linux is recommended for production. macOS and Windows work for development.

## The client binary

You need `purechain-geth` — **stock geth will not work**. It panics past the
Shanghai/Cancun activation, and upstream removed Clique entirely in v1.14.

Build it with Go 1.20 or later (1.21+ recommended):

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o geth ./cmd/geth
./geth version   # -> 1.13.15-stable
```

That produces a statically linked linux/amd64 binary that runs anywhere,
including minimal and Alpine containers. See
[Building from source](../04-client/building-from-source.md) for alternatives and
the WSL notes.

## Signer keys

Generate one Ethereum keypair per validator before creating the genesis — you
need the **addresses** to nominate them as signers.

```bash
geth account new --datadir ./keys
```

!!! danger "Use real keys, not example keys"
    Never reuse keys from tutorials, test fixtures, or well-known development
    accounts (hardhat, ganache). Their private keys are public.

## Plan your chain ID

Pick a chain ID that doesn't collide with an existing network — check
[chainlist.org](https://chainlist.org). Avoid `1` (mainnet) and other reserved
values.

Documentation examples use `424242` as a generic placeholder. **Choose your own.**

## Next

[Create the genesis →](genesis.md)
