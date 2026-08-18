# 5. Verify it works

Four checks. If all pass, your network is running correctly.

## 1. Blocks are being produced

```js
eth.blockNumber        // should advance
eth.getBlock("latest")
```

## 2. The base fee is zero

```js
eth.getBlock("latest").baseFeePerGas    // -> 0
```

If it's non-zero, `zeroBaseFee` isn't set in your genesis — and every node needs
re-initializing with a corrected file.

## 3. Cancun is live

```js
eth.getBlock("latest").parentBeaconBlockRoot   // present -> Cancun active
eth.getBlock("latest").withdrawalsRoot         // present -> Shanghai active
```

## 4. A zero-fee transaction mines — and relays

This is the check that catches the most common misconfiguration.

```bash
curl -s http://127.0.0.1:8545 -H 'Content-Type: application/json' --data '{
  "jsonrpc":"2.0","id":1,"method":"eth_sendTransaction",
  "params":[{"from":"0x..","to":"0x..","value":"0x1","gasPrice":"0x0"}]
}'
```

Then confirm it mined with a zero effective price:

```js
eth.getTransactionReceipt("<hash>").effectiveGasPrice   // -> 0
```

!!! danger "Submit through an RPC node, not a validator"
    Sending through a validator proves only that *it* accepted the transaction.
    Submitting through a non-sealing RPC node proves the transaction actually
    **relayed** across the network — which is what breaks when
    `--txpool.pricelimit 0` is missing somewhere.

## All nodes agree

```js
eth.getBlock(eth.blockNumber).hash    // compare across every node
```

Divergent hashes mean a split — usually from a mismatched genesis or nodes
started simultaneously.

## Automated tests

The client repository ships a smoke-test suite:

```bash
bash smoke-test/run.sh             <geth>   # mine Cancun blocks without panic
bash smoke-test/freegas-rpc.sh     <geth>   # zero-fee tx, effectiveGasPrice 0
bash smoke-test/metamask-compat.sh <geth>   # wallet RPC compatibility
bash smoke-test/push0.sh           <geth>   # PUSH0 / Solidity 0.8.20+
bash smoke-test/ethers-compat.sh   <geth>   # ethers.js v6
```

## Connect a wallet

See [Wallets and apps](../05-reference/wallets.md) — add the network with your
chain ID and RPC URL.

!!! note "The geth console can't send zero-fee transactions"
    Its bundled `web3.js` blocks them client-side. The node accepts them fine —
    use JSON-RPC or ethers.js.

## Next

[Production checklist →](production.md)
