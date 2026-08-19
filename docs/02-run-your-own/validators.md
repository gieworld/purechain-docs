# 3. Start validators

Validators (Clique *signers*) produce and seal blocks.

## Initialize each node

Once per node, using the **byte-identical** genesis file:

```bash
geth --datadir ./data init genesis.json
geth --datadir ./data account import <signer-key-file>
```

## Start the first validator

```bash
geth --datadir ./data \
  --networkid 424242 \
  --unlock <signer-address> --password <pwfile> --allow-insecure-unlock \
  --mine --miner.etherbase <signer-address> \
  --miner.gasprice 0 \
  --txpool.pricelimit 0 \
  --syncmode full --gcmode archive --snapshot=false \
  --nodiscover \
  --port 30303 \
  --http --http.addr 127.0.0.1 --http.port 8545 \
  --http.api eth,net,web3,admin,miner,txpool,clique
```

With one signer, the chain starts producing blocks immediately. **A single-signer
network is now running** — enough for local development.

!!! danger "Never expose a validator's RPC publicly"
    That API set includes `admin`, `miner`, and `clique`. Bind it to `127.0.0.1`
    or a private interface. Public RPC nodes get `eth,net,web3` only —
    see [Add RPC nodes](rpc-nodes.md).

## Add the remaining validators

!!! danger "One at a time"
    Starting every validator simultaneously can split the network before the
    peer mesh exists. Start one, confirm it's ready and peered, then start the
    next.

For each additional validator:

1. `init` with the same genesis, import its signer key.
2. Start it with the same flags (its own `--miner.etherbase`).
3. **Peer it**, then verify:

```js
admin.addPeer("enode://<pubkey>@<host>:30303")
admin.peers.length    // must be > 0 — retry addPeer if still 0
```

Get a node's enode with `admin.nodeInfo.enode`.

4. Confirm it agrees with the others on the chain head **before** moving on:

```js
eth.blockNumber
eth.getBlock(eth.blockNumber).hash    // must match across nodes
```

## Adding signers later

Signers nominated in genesis are automatic. To add one afterwards, a **majority
of current signers** must each propose it:

```js
clique.propose("0x<new-signer>", true)     // add
clique.propose("0x<signer>", false)        // remove
clique.getSigners()                        // current set
clique.proposals                           // in-flight, on this node
```

Changes settle at the next epoch checkpoint.

## Optional: on-demand sealing

With `--mine`, validators seal continuously — producing **empty blocks forever**,
even when idle. Fine for development; wasteful for a long-running network.

The alternative is to drop `--mine` and run a sidecar that starts and stops the
miner based on activity. See [Smart Auto Mining](../03-operating/sealing.md).

## Next

[Add RPC nodes →](rpc-nodes.md)
