# Request node access

Anyone can run a PureChain node — but because peer discovery is **off**
(`--nodiscover`), a node cannot find the network on its own. You need a peer
provisioned for you, so node access goes through a short request.

!!! tip "Just want to read the chain or send transactions?"
    You don't need a node at all. Point your wallet or app at the public RPC
    endpoint — see [Wallets and apps](../05-reference/wallets.md).

## Where to request

> **Request portal:** <https://purechain-portal-frontend.onrender.com/>

## How it works

1. **Apply** in the portal: organisation, purpose, a technical and a backup
   contact, and where you'll host the node.
2. **Get approved.** You are assigned a node name and can download the
   member-node bundle (Docker, the pinned `purechain-geth`, genesis and peers
   included).
3. **Run the bundle** on a Linux x86-64 host with a static public IP, following
   the step-by-step guide in the portal.
4. **Register the node**: its public IP(s) and node ID (`./node.sh enode`), plus
   a first-sync date.
5. PureChain opens the firewall for your IP, and the portal shows your node as
   `active` once it is connected.

PureChain never asks for private keys, keystores, passwords, SSH access or wallet
addresses. Treat any such request as phishing.

## What's expected of you

Lightweight compared to [validator requirements](../06-join/validator-requirements.md),
but these matter:

- Run the **bundle as shipped**. It pins the `purechain-geth` release (stock geth
  cannot follow this chain) and the zero-fee settings.
- **Don't expose `admin`, `personal`, `debug`, or `miner` RPC publicly**. The
  bundle serves `eth,net,web3` only, on `127.0.0.1`.
- **Don't publish the peer details in the bundle.** Peering details are not public.

## Next

Building your own setup instead of the bundle? See the
[Quickstart](../02-run-your-own/index.md).

Thinking about validating? See [Become a validator](../06-join/index.md).
