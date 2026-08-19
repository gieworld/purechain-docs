# Validator requirements

Read this **before** applying. Validators seal blocks on a Clique network with no
slashing — the admission bar is how the network stays safe, so these are
conditions of joining, not suggestions.

## Why the bar is high

Clique needs a majority of signers to make progress, and a signer that just
sealed is barred from sealing again for a window. Small sets lose liveness fast:

| Signers | Can lose | Chain **halts** at |
|---:|---:|---:|
| 4 | 1 | 2 down |
| 5 | 2 | 3 down |
| 7 | 3 | 4 down |

There is no economic penalty for going offline — **validator liveness *is* chain
liveness.** One unreliable validator measurably degrades the network for everyone.

---

## Hard requirements

These are non-negotiable. A validator that cannot meet them will not be voted in,
and may be voted out.

### Infrastructure

- [ ] **Archive node**, full sync — `--syncmode full --gcmode archive --snapshot=false`.
- [ ] Hardware meeting the [node requirements](../02-run-your-own/prerequisites.md),
      with headroom — archive storage grows continuously.
- [ ] **Stable network** and reliable power; redundancy strongly preferred.
- [ ] **Reachable on-call contact** and a committed response window.
- [ ] Agreed **uptime SLA**. <!-- TODO: state the actual figure -->

### Client configuration

- [ ] Run the **pinned `purechain-geth` release** — never stock geth, never an
      unreleased build.
- [ ] **`--txpool.pricelimit 0`** — without it your node silently stops relaying
      zero-fee transactions.
- [ ] `--miner.gasprice 0`.
- [ ] `--miner.recommit` matching the current signer set (e.g. `750ms`).
- [ ] **`--nodiscover`** with static peering only.
- [ ] **Automine sidecar** for on-demand sealing — validators do **not** pass
      `--mine`. See [Smart Auto Mining](../03-operating/sealing.md).

### Security

- [ ] **Never expose the validator's RPC publicly.** The signer API set includes
      `admin`, `personal`, `miner`, `debug`, and `clique` — bind it to localhost
      or a private interface. Public RPC nodes serve `eth,net,web3` only.
- [ ] **Treat your enode as sensitive.** Validator enodes are never published.
- [ ] Dedicated signer key, stored securely, used for nothing else.

### Operational discipline

- [ ] **Strict relay check after every restart** — a restarted node silently
      stops relaying until re-armed. See [Operations](../03-operating/operations.md#after-every-restart).
- [ ] **Never run `debug.setHead`.** In-place rewinds can fork the chain. Resync
      from genesis instead.
- [ ] **Coordinate every restart and upgrade** with the signer set — bring-up is
      sequential. See [Operations](../03-operating/operations.md#bring-up-and-restarts).
- [ ] **Keep a pre-upgrade datadir backup.** Past the fork boundary, rolling back
      is not a binary swap.
- [ ] **Monitoring and alerting** on block production, your own missed sealing
      turns, and peer count.
- [ ] **Announce planned downtime in advance.** Never disappear unannounced.
- [ ] **Respond to governance votes** on adding and removing signers.

---

## Best practices

Not gating conditions, but what good validators do.

- **Automate the relay check** so it runs on every restart rather than from memory.
- **Rehearse upgrades** on a non-production node before touching your validator.
- **Alert on missed sealing turns**, not just on the node being down — a node can
  be up, synced, peered, and still not sealing.
- **Watch peer count as a first-class metric.** With discovery off, losing static
  peers means silent isolation.
- **Keep your automine sidecar config in version control** alongside your node config.
- **Document your own runbook** — who to call, how to restart, where the backup is.

---

## Expectations once admitted

- Maintain the agreed SLA.
- Stay on the pinned release; upgrade when the signer set coordinates it.
- Participate in governance.
- Coordinate your exit — see [Operations](../03-operating/operations.md#leaving-the-set).

## Ready to apply?

See [How to apply](validator-apply.md).
