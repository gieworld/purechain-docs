# How to apply

!!! info "Start with the requirements"
    Read [Validator requirements](validator-requirements.md) first. Applications are
    assessed against them directly.

## Where to apply

<!-- TODO: replace with the validator request website link -->

> **Request portal:** _link coming soon_

## What to include

- **Operator identity** — individual or organization, plus a named point of contact.
- **Node track record** — how long you've run a PureChain node, and evidence of
  uptime. Running a node first is the expected path.
- **Signer address** — the `0x…` address to be voted in.
- **Infrastructure** — region(s), hosting, redundancy, on-call coverage.
- **Confirmation** that you can meet every item under
  [hard requirements](validator-requirements.md#hard-requirements).
- **Bond / stake**, if required. <!-- TODO: team decision -->

## What happens next

```
Apply  ──▶  Reviewed against requirements  ──▶  Existing signers vote  ──▶  Admitted
                                                clique.propose(addr, true)
                                                    majority required
```

1. Your application is assessed against the published requirements.
2. Current signers vote via `clique_propose` — see
   [signer onboarding](../02-run-your-own/validators.md).
3. On majority approval, your address joins the authorized signer set.
4. You configure your node to seal and coordinate bring-up with the signer set.

## Just want to run a node?

That's a lighter, separate request — see
[Request node access](../06-join/node-access.md).
