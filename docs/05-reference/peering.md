# Peering

PureChain's P2P layer is **permissioned**, like its validator set.

Nodes run with **`--nodiscover`** — Ethereum's peer discovery protocol is off —
and peers are added explicitly as **static peers** at startup. There are no
public bootnodes.

## Why discovery is off

Discovery exists so anonymous nodes can find each other on a public network. On a
permissioned chain it mostly creates exposure:

- A published bootnode is a **stable, named DoS target**. Flood it and new nodes
  can't join.
- Enodes reveal **infrastructure topology and IP addresses**.
- For validators specifically, a published enode is a **direct route to the
  machines that produce blocks**. Clique has no slashing, so validator liveness
  *is* chain liveness.

!!! danger "Validator enodes are never published"
    Signer nodes are not publicly reachable and their enodes are not documented
    here or anywhere else public. If you operate a validator, treat your enode as
    sensitive infrastructure detail.

## How to connect

=== "Use the public RPC"

    The zero-setup path. Point MetaMask, ethers, or Hardhat at the public RPC
    endpoint — no node, no peering, no request needed.

    See [Wallets and apps](../05-reference/wallets.md).

=== "Run your own node"

    Because discovery is off, you need a peer to be provisioned for you. Request
    peering when you apply to run a node — you'll receive the enode(s) to peer
    with, and your node's enode will be added on the other side.

    <!-- TODO: publish the request channel / application form -->

## Static peering mechanics

Peers are added over IPC once the node is accepting connections:

```js
admin.addPeer("enode://<pubkey>@<host>:30303")
```

Verify it took:

```js
admin.peers.length    // must be > 0
```

!!! warning "Add peers *after* the node is up, and verify"
    Attaching as soon as the IPC socket appears is not enough — `addPeer` can
    silently no-op and leave the node isolated with 0 peers. Wait until IPC is
    actually accepting connections, call `addPeer`, then **confirm
    `admin.peers.length > 0` and retry if it's still 0.** This failure was
    observed in production during the Istanbul→Cancun upgrade.

## If discovery is ever enabled

If the network later opens public peering, it should be through **dedicated
public-facing nodes** whose enodes are published — never validator enodes.
Validators stay `--nodiscover` and statically peered to those nodes only.
