# Join the public network

!!! tip "Most people want [Run your own network](../02-run-your-own/index.md) instead"
    PureChain is open source — you can run your own permissioned, free-gas chain
    with your own validators, on your own infrastructure. That's the main path
    through these docs.

    This section is for people who want to participate in **the public network we
    operate**, rather than running their own.

## Two ways to participate

| | **Run a node** | **Become a validator** |
|---|---|---|
| **How** | Short request | Application + signer vote |
| **Bar** | Light | High — see [requirements](validator-requirements.md) |
| **You get** | Peering details + genesis | A seat in the signer set |
| **Start** | [Request node access](node-access.md) | [Requirements](validator-requirements.md) → [apply](validator-apply.md) |

## Why both are by request

Peer discovery is disabled network-wide (`--nodiscover`), so a node cannot find
the network on its own — peering has to be provisioned. That makes every
participant a deliberate addition rather than a policy choice bolted on top. See
[Peering](../05-reference/peering.md).

Validation is gated further: Clique has **no slashing**, so a malicious or
offline signer degrades liveness with no automatic penalty, and small signer sets
halt quickly when validators go down. The admission vote is the safety mechanism.

## Just want to use the chain?

You don't need a node at all — point your wallet or app at the public RPC
endpoint. See [Wallets and apps](../05-reference/wallets.md).
