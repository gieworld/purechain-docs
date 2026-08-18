# 4. Add RPC nodes

RPC nodes don't seal. They serve wallets, apps, explorers, and indexers — and
keep that traffic off your validators.

!!! tip "Why bother?"
    Your validators should not be publicly reachable. RPC nodes are the public
    face of the network; validators stay private and peer only to nodes you
    control.

## Start one

```bash
geth --datadir ./data init genesis.json   # same genesis

geth --datadir ./data \
  --networkid 424242 \
  --syncmode full --gcmode archive --snapshot=false \
  --nodiscover \
  --port 30303 \
  --http --http.addr 0.0.0.0 --http.port 8545 \
  --http.api eth,net,web3 \
  --http.corsdomain '*' --http.vhosts '*' \
  --txpool.pricelimit 0 \
  --miner.gasprice 0 \
  --gpo.ignoreprice 0 --gpo.maxprice 1000000000 --gpo.percentile 0 \
  --cache 256 \
  --maxpeers 25
```

Then peer it to a validator and verify:

```js
admin.addPeer("enode://<validator-pubkey>@<host>:30303")
admin.peers.length    // must be > 0
```

## The flags that matter

| Flag | Why |
|---|---|
| `--http.api eth,net,web3` | **Minimal public surface.** Never expose `admin`, `personal`, `debug`, `miner`, or `clique` |
| `--txpool.pricelimit 0` | **Required.** Without it the node drops and refuses to relay zero-fee transactions |
| `--gpo.*` | Makes `eth_gasPrice` report 0 so wallets don't try to overpay |
| `--http.corsdomain` / `--http.vhosts` | Needed for browser wallets; scope them tighter than `*` in production |
| `--gcmode archive` | Keeps full history — required by most explorers |

!!! warning "The GPO flags are not cosmetic"
    Without them the gas-price oracle can report a non-zero price on a free-gas
    chain, and wallets will construct transactions your validators may reject.

## Add WebSocket

Explorers and subscription-based apps usually need it:

```bash
--ws --ws.addr 0.0.0.0 --ws.port 8546 --ws.api eth,net,web3 --ws.origins '*'
```

## Scaling out

Add as many RPC nodes as you need — they're stateless from the network's point of
view. Put them behind a load balancer and peer each one to your validators.

## Next

[Verify it works →](verify.md)
