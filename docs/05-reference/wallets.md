# Connecting wallets and apps

PureChain speaks standard Ethereum JSON-RPC, so MetaMask, ethers, Hardhat, and
block explorers work without modification.

## Network details

| Field | Value |
|---|---|
| Network name | PureChain |
| RPC URL | <!-- TODO --> |
| Chain ID | <!-- TODO --> |
| Currency symbol | <!-- TODO --> |
| Block explorer | <!-- TODO --> |

## Sending a zero-fee transaction

Set `gasPrice` to `0x0` (legacy), or zero EIP-1559 fee fields.

=== "curl / JSON-RPC"

    ```bash
    curl -s http://127.0.0.1:8545 -H 'Content-Type: application/json' --data '{
      "jsonrpc":"2.0","id":1,"method":"eth_sendTransaction",
      "params":[{"from":"0x..","to":"0x..","value":"0x1","gasPrice":"0x0"}]
    }'
    ```

=== "ethers.js v6"

    ```js
    import { JsonRpcProvider, Wallet } from "ethers";

    const provider = new JsonRpcProvider("<RPC_URL>");
    const wallet   = new Wallet("<PRIVATE_KEY>", provider);

    await wallet.sendTransaction({
      to: "0x...",
      value: 1n,
      gasPrice: 0n,     // free gas
    });
    ```

!!! note "The bundled `geth` console will refuse"
    Its old `web3.js` blocks zero-fee transactions **client-side**. The node
    accepts them — use JSON-RPC or a modern library instead.

## Gotchas

- **No replace-by-fee.** A pending transaction can't be bumped or cancelled at
  zero fee. Wait for it to mine.
- **Contract size limit is still 24 KB** (EIP-170) — free gas does not change it.
- **PUSH0 is available** (Shanghai), so Solidity 0.8.20+ default targets work.
