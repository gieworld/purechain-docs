# On-demand sealing

PureChain validators do **not** run with `--mine`. Each validator runs an
**automine sidecar** that attaches over IPC and starts or stops the miner based
on network activity.

The result: no empty blocks while the network is idle, and sealing resumes
automatically when transactions arrive.

!!! info "`eth.mining == false` while idle is correct"
    Expect the miner to be stopped during quiet periods. That is the feature
    working, not a fault. All validators wake together when activity resumes.

## Operating notes

- The sidecar configuration is provided during validator onboarding. Keep it in
  version control alongside your node config.
- After a restart the sidecar reattaches, but you still need the
  [strict relay check](operations.md#after-every-restart).
- **Freeze the sidecar before testing whether your node relays** — otherwise your
  node can pass the check by mining its own transaction.
- If your validator stays idle while others are sealing, investigate peering and
  transaction-pool state.
- The sidecar logs a warning if it detects pending work while the chain head is
  not advancing. Treat those as worth investigating, not routine noise.
