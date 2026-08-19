# Running with Docker

Nodes run as containers: the upstream `ethereum/client-go` image with the
PureChain binary swapped in.

## Build the image

```dockerfile
FROM ethereum/client-go:v1.13.14

ARG GETH_BIN
COPY bin/${GETH_BIN} /usr/local/bin/geth
RUN apk add --no-cache bash curl
COPY scripts/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh /usr/local/bin/geth

WORKDIR /data
EXPOSE 30303 30303/udp 8545 8551
ENTRYPOINT ["/entrypoint.sh"]
```

```bash
docker build -f Dockerfile.node --build-arg GETH_BIN=geth-linux-amd64 \
  -t purechain-node:<tag> .
```

Only the binary differs from upstream — the base image supplies the runtime.

!!! warning "Keep the `sed` line-ending fix"
    A CRLF-checked-out entrypoint fails to execute in the container with a
    confusing error. This matters if you check out on Windows.

## Compose

```yaml
services:
  node:
    image: purechain-node:<tag>
    restart: unless-stopped
    stop_signal: SIGINT
    stop_grace_period: 2m
    volumes:
      - ./data:/data
      - ./scripts:/scripts
    command:
      - "--datadir=/data"
      - "--networkid=<chainId>"
      - "--syncmode=full"
      - "--gcmode=archive"
      - "--snapshot=false"
      - "--nodiscover"
      - "--http"
      - "--http.addr=0.0.0.0"
      - "--http.api=eth,net,web3"
      - "--txpool.pricelimit=0"
      - "--miner.gasprice=0"
      - "--gpo.ignoreprice=0"
      - "--gpo.maxprice=1000000000"
      - "--gpo.percentile=0"
```

!!! danger "Shut down with SIGINT and a real grace period"
    `stop_signal: SIGINT` with `stop_grace_period: 2m` lets geth close its
    database cleanly. A hard kill risks corruption and a full resync.

## Startup and peering

The entrypoint starts geth, then adds static peers once IPC is accepting
connections — and **verifies `admin.peers.length > 0`, retrying if not**. A
socket file existing does not mean geth is ready; attaching too early leaves the
node running with zero peers. See [Peering](../05-reference/peering.md).

## Validators

Validators additionally run an automine sidecar sharing the node's `/data` volume
to reach `geth.ipc`. See [Smart Auto Mining](../03-operating/sealing.md).

!!! danger "Never start all nodes at once"
    Simultaneous starts can split a Clique network before the peer mesh exists.
    Bring nodes up one at a time — see
    [Operations](../03-operating/operations.md#bring-up-and-restarts).
