# Proof-of-Authority and Association (PoA²)

**PoA²** is PureChain's validator-management layer. It watches how each signer is
actually behaving and **automatically replaces inactive or underperforming
validators** with pre-vetted standby signers — instead of waiting for an operator
to notice and file a manual proposal.

It is the second of the two core innovations in the Purechain paper — see
[Research](../05-reference/research.md).

!!! info "PoA² is a controller, not a consensus change"
    It runs **on top of** stock Clique using standard RPC —
    `clique.status().sealerActivity`, `clique.propose()`, `clique.discard()`.
    Nothing in `purechain-geth` implements PoA²; the
    [client fork](../04-client/consensus-changes.md) is only about Clique +
    Cancun + free gas. You can run PoA² against any Clique network, and you can
    run PureChain without it.

## How replacement works

```
Monitor sealer activity  ──▶  Flag inactive signer  ──▶  De-authorization proposal
   (64-block windows)            (zero activity)                   │
                                                                   ▼
        Signer set updated  ◀──  Majority vote  ◀──  Propose standby validator
```

1. **Misbehavior detection** — sealer activity is sampled over fixed windows of
   **64 blocks**. A signer with zero activity in a window is flagged.
2. **De-authorization proposal** — broadcast to the validator set.
3. **Redundant validator proposal** — a pre-vetted standby signer is nominated
   from a reserve pool.
4. **Voting** — active validators vote on chain. A simple majority
   `q = floor(n/2) + 1` is required; votes are carried in block headers.
5. **Set update** — the flagged signer is de-authorized and the standby takes over.

## Timing

Replacement time is `T_replace = T_detect + T_vote + T_apply`.

With a one-second block period and a 64-block detection window:

| Phase | Bound |
|---|---|
| `T_detect` | ≤ 64 s (the window boundary) |
| `T_vote` | ~n seconds — about one signer rotation, if all voters are online |
| `T_apply` | ≤ 2 blocks |

## Requirements and limits

- **At least 3 active validators** (`n ≥ 3`).
- **A standby pool** of pre-vetted, identity-checked signers ready to activate.
- **Quorum governs everything.** With fewer than `q` validators online — or a
  network partition splitting them into groups smaller than `q` — proposals do
  not pass and the signer set does not change until connectivity returns. This is
  the safe failure mode: no change beats a wrong change.

## The energy trade-off

Standby validators are full nodes that are not mining, and they cost far less to
run:

| Node | Consumption over 10 minutes |
|---|---:|
| Active signer (mining) | 637 Wh |
| Redundant standby (full node, not mining) | 157 Wh |

An active miner uses roughly **four times** the energy of a standby. More
redundancy buys resilience but raises total consumption — size the standby pool
deliberately.

## Operating alongside SAM

The two are independent and complementary: [SAM](sealing.md) decides *when*
validators seal, PoA² decides *which* validators are in the set.

One interaction to be aware of: SAM legitimately stops the miner during idle
periods. A validator-activity monitor must not read that as misbehavior — sealer
activity is meaningful only across windows where the network was actually
producing blocks.

## Manual alternative

If you're [running your own network](../02-run-your-own/index.md), you don't need
PoA² — the same actions are available manually:

```js
clique.getSigners()                   // current set
clique.propose("0x<addr>", true)      // vote to add
clique.propose("0x<addr>", false)     // vote to remove
clique.status()                       // recent sealing activity
```

PoA² automates exactly this loop. Start manual; add automation when the set is
large enough that noticing an idle signer by hand stops being realistic.
