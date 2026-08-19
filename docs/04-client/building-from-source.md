# Building purechain-geth from source

!!! tip "You may not need to build anything"
    Prebuilt static binaries for linux/amd64 and linux/arm64 are published on
    the [releases page](https://github.com/gieworld/purechain_testnet/releases/latest).
    See [Download and install](download.md). Build from source when you want to
    verify the release, target another platform, or run a modified client.

Clone the client repository first:

```bash
git clone https://github.com/gieworld/purechain_testnet.git
cd purechain_testnet
```

## Prerequisites

- Go 1.19 or later, and a C compiler (only needed for CGO builds).
- git.

## Recommended — portable static binary

This is the deployed release artifact. It works from any OS with the Go
toolchain and produces a statically linked linux/amd64 binary that runs on any
Linux x86-64, including minimal/Alpine containers:

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/bin/geth-linux-amd64 ./cmd/geth
./build/bin/geth-linux-amd64 version
# -> 1.13.15-stable, Git Commit = your HEAD
```

To reproduce a published release exactly, check out its tag first — the binary
will then stamp the same commit the release reports:

```bash
git checkout v1.0.0
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -o geth ./cmd/geth
./geth version   # Git Commit must match the release
```

!!! warning "Build from a normal checkout, not a `git worktree`"
    On Go 1.21 a worktree build silently omits the VCS stamp, leaving
    `Git Commit` empty — an artifact nobody can trace back to source.

## Alternative — `make`

```bash
make geth        # just geth
make all         # full tool suite
```

## Verify you built the right thing

```bash
git log --oneline v1.13.15..HEAD    # the patch set
git diff  v1.13.15..HEAD -- '*.go'  # cross-check vs consensus-changes.md
```

## Windows / WSL note

If you build *inside* WSL, use the native Linux filesystem. Building on a
Windows `/mnt/...` mount crashes the Go compiler (9p mount issue):

```bash
rsync -a --delete --exclude='.git' --exclude='build/bin' \
  /mnt/d/Projects/<repo>/ ~/geth_build/
cd ~/geth_build && go build -o geth ./cmd/geth
```

Similarly, generate `genesis.json` **inside WSL** — PowerShell redirects produce
UTF-16, which geth rejects.

## Verification suite

The repository ships a dockerized smoke-test suite:

```bash
bash smoke-test/run.sh              <geth>   # mine Cancun blocks without panic
bash smoke-test/freegas-rpc.sh      <geth>   # zero-fee tx, effectiveGasPrice 0
bash smoke-test/metamask-compat.sh  <geth>   # wallet RPC (eth_feeHistory etc.)
bash smoke-test/push0.sh            <geth>   # PUSH0 / Solidity 0.8.20+
bash smoke-test/ethers-compat.sh    <geth>   # ethers.js v6
```

Before a production upgrade, the one to run is
`smoke-test/upgrade-rigorous.sh <orig> <patched>` — it builds a real chain on
stock geth, re-inits in place with the patched binary, crosses every fork, and
asserts state, balances, and contract storage survive byte-for-byte.
