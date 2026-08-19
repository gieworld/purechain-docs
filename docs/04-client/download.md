# Download and install

Prebuilt binaries are published on the client repository's
[releases page](https://github.com/gieworld/purechain_testnet/releases/latest).

They are **statically linked** (`CGO_ENABLED=0`), so they have no libc
dependency and run on any Linux x86-64 or ARM64 host — including minimal and
Alpine containers.

| Asset | Platform |
|---|---|
| `purechain-geth-<version>-linux-amd64` | Linux x86-64 |
| `purechain-geth-<version>-linux-arm64` | Linux ARM64 (incl. AWS Graviton) |
| `SHA256SUMS.txt` | checksums for the above |

## Install

```bash
VERSION=v1.0.0
BASE=https://github.com/gieworld/purechain_testnet/releases/download/${VERSION}

curl -LO ${BASE}/purechain-geth-${VERSION}-linux-amd64
curl -LO ${BASE}/SHA256SUMS.txt

# Verify before running it
sha256sum -c SHA256SUMS.txt --ignore-missing

chmod +x purechain-geth-${VERSION}-linux-amd64
sudo mv purechain-geth-${VERSION}-linux-amd64 /usr/local/bin/geth

geth version
```

## Verify what you are running

`geth version` prints the commit the binary was built from:

```
Version: 1.13.15-stable
Git Commit: 1118041499edb224376d6df7e651b240b620abbd
```

That commit exists in the [client repository](https://github.com/gieworld/purechain_testnet),
so you can check out the same tag and rebuild it yourself — the release
workflow refuses to publish a binary whose stamp does not match the commit it
was built from.

!!! warning "An empty `Git Commit` means an untraceable build"
    If you build your own binary and `Git Commit` comes back empty, you built
    from a `git worktree` — on Go 1.21 that silently omits the version stamp.
    Build from a normal checkout. See [Building from source](building-from-source.md).

## In a container

The binary is static, so it drops straight into a minimal image:

```dockerfile
FROM alpine:3.20
COPY purechain-geth-v1.0.0-linux-amd64 /usr/local/bin/geth
RUN apk add --no-cache bash ca-certificates
ENTRYPOINT ["geth"]
```

See [Running with Docker](../02-run-your-own/docker.md) for a full node setup.

## Which version to run

Every node on a network must run a binary that agrees on consensus rules. Past
Shanghai/Cancun activation, stock geth cannot follow the chain at all — see
[the compatibility boundary](purechain-geth.md#compatibility-boundary).

Upgrading between PureChain releases is cumulative: no genesis, config, or
on-disk format change. Roll nodes **one at a time**, and downgrade the same way
if you need to abort. A Clique network needs `len(signers)/2 + 1` signers
online to keep producing blocks, so with four validators only one may be down
at any moment.

## Next

- [Building from source](building-from-source.md) — reproduce the release yourself
- [What changed vs upstream](consensus-changes.md)
- [Run your own network](../02-run-your-own/index.md)
