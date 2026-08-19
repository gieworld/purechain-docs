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

1. **Misbehavior detection** — sealer activity is sampled over a **trailing
   window of 64 blocks**, recomputed on every check. A signer with zero
   activity in that window is flagged as a suspect.
2. **Confirmation** — a suspect must *stay* silent before anything is proposed.
   A validator restarting for a routine upgrade reads exactly like a dead one
   at first, and recovers on its own; a dead one does not.
3. **Redundant validator proposal** — a pre-vetted standby is nominated from
   the reserve pool, chosen deterministically so every validator nominates the
   same one.
4. **Voting** — active validators vote on chain. A simple majority
   `q = floor(n/2) + 1` is required; votes are carried in block headers.
5. **Verification** — the promoted standby must actually seal before anything
   else happens. If it does not, it is rolled back (see
   [phantom standbys](#phantom-standbys)).
6. **Set update** — only once a working replacement is sealing is the flagged
   signer de-authorized. If the pool is empty the signer is removed anyway, on
   a smaller set — see [when the pool runs out](#when-the-pool-runs-out).

The order matters: the standby is added **first** and the failed signer removed
**second**, so the set never dips below its normal size and a bad candidate
cannot leave you worse off than before.

## Timing

Detection is measured in **blocks, not seconds** — an important distinction on a
chain that only seals when there is work. With [SAM](sealing.md), 64 blocks can
span far more than 64 seconds of wall-clock time if the network goes idle, so
treat the figures below as *"while the chain is busy"*.

Measured on a four-signer network at a one-second period, under load:

| Phase | Measured |
|---|---|
| Detect (activity window empties) | ~64 s |
| Confirm (suspect stays silent) | ~120 blocks |
| Vote + apply | a few seconds |
| **Total, unreachable validator** | **~195 s** |

A validator that is still reachable but not sealing is deliberately given much
longer — see [below](#down-versus-not-sealing).

## Requirements and limits

- **At least 3 active validators** (`n ≥ 3`).
- **A standby pool** of pre-vetted signers, each with a node that is actually
  running, synced and unlocked — see [phantom standbys](#phantom-standbys).
- **The controller must run on every validator**, including a standby once it is
  promoted. `clique.propose()` casts a *local* vote, so a proposal only carries
  with a majority of the **current** signer set; a promoted standby that is not
  running the controller silently erodes the voting quorum with each
  replacement, until no proposal can pass at all.
- **An identical pool on every controller.** Candidate selection is
  order-deterministic so that all validators nominate the same standby. Differing
  lists mean split votes and nothing carries.
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

## Down versus not sealing

Zero sealer activity has two very different causes, and `clique.status()` cannot
tell them apart:

- the node is **down** — replacing it is exactly right;
- the node is **up, synced and serving RPC**, but not sealing (typically its
  sealing sidecar died) — replacing it consumes a standby for something an
  operator fixes in seconds.

They *are* distinguishable one layer down: a node that is down leaves the p2p
network, while one that is merely not sealing stays connected. PoA² therefore
looks the suspect up in `admin.peers` and responds differently:

| Suspect | Response |
|---|---|
| Gone from the peer list | Replace after the normal confirmation (~2 min) |
| Still connected | **Warn loudly**, and replace only if it stays silent for ~10 minutes |

It still replaces a persistently silent validator either way — one that never
seals is not contributing, whatever the reason — but an operator gets a real
window to act first.

!!! warning "Watch for sidecar death directly"
    Do not rely on PoA² to be gentle about this. Monitor that each validator's
    sealing sidecar is alive, and alert on the
    `REACHABLE but not sealing` warning. The standby pool is finite; repeated
    sidecar failures will burn through it.

## Phantom standbys

A standby address with **no running node behind it** is the most dangerous thing
you can put in the pool. Promoted, it never seals — yet it still counts toward
`len(signers)`, which raises Clique's recent-signer bar (`floor(n/2)+1`). Enough
of them and the mechanism meant to heal the chain halts it instead, automatically
and unattended.

PoA² guards against this by verifying its own work: a promoted standby must seal
within a short window or it is voted back out, remembered, and the next
candidate is tried — and **the failed validator is never removed until a working
replacement is in place**. Measured: a phantom was promoted, caught and rolled
back about a minute later, and a real standby took over, with the chain
advancing throughout.

That is a safety net, not a licence. Keep the pool accurate: every address in it
should have a synced, unlocked node running.

## When the pool runs out

Standby pools are finite, and every replacement consumes one. Eventually a
validator can fail with nothing left to promote.

The intuitive response — leave the dead signer in place and wait for an
operator — is the **worse** of the two available states. Clique needs
`floor(n/2) + 1` signers to seal:

| Set | Dead | Healthy | Sealers required | Margin |
|---|---|---|---|---|
| 4 signers, dead one left in | 1 | 3 | 3 | **none** — the next failure halts the chain |
| 3 signers, dead one removed | 0 | 3 | 2 | one spare |

So PoA² **removes the dead signer anyway** and runs on a smaller set. It is not
giving up; it is the safer configuration, and the log prints the arithmetic so
it is clear why the set shrank. Before doing so it retries any standby
previously written off as unreachable — one whose node was down earlier may be
running now.

The set is never shrunk below **three** signers. At two, both must seal and the
benefit reverses, so PoA² stops there and reports that operator action is
required.

!!! danger "Shrinking buys time, it does not replace capacity"
    A smaller set has fewer signers to lose. Restore a standby — or repair the
    failed validator — as soon as you see an exhaustion warning.

## Operating alongside SAM

The two are independent and complementary: [SAM](sealing.md) decides *when*
validators seal, PoA² decides *which* validators are in the set.

Two interactions matter in practice:

- **SAM legitimately stops the miner when the network is idle.** Sealer activity
  is only meaningful across windows where the chain was actually producing
  blocks, which is why detection is expressed in blocks rather than seconds.
- **Do not start PoA² on a freshly restarted or idle chain.** The 64-block
  window will still be full of history from before the pause — including any
  validator that was legitimately down then. Let every validator seal into the
  current window first.

## During maintenance

**Stop PoA² before a rolling upgrade and restart it afterwards.**

A validator restarting for an upgrade stops sealing, which is indistinguishable
from failure until the confirmation window clears it. The confirmation step
exists precisely to survive this, and it does — but a slow restart on a chain
with a lot of history can outlast it, and having the validator set mutate in the
middle of a planned upgrade is not a risk worth taking for no benefit.

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
