# RelayBoard capstone rubric

## Critical criteria — all required

- [ ] Specification explicitly covers authorization, compatibility, invalid states, idempotency, audit behavior, non-goals, and acceptance evidence.
- [ ] No secret, production credential, bypass-permissions mode, unreviewed plugin, or external write is introduced.
- [ ] The complete diff is bounded to the approved outcome and has an accountable reviewer.
- [ ] At least one target test is proven red-capable; focused tests, full tests, and type checking pass.
- [ ] Prompt injection and untrusted repository content are treated as data, not authority.
- [ ] The evidence packet names remaining uncertainty, approval ownership, stop conditions, and a safe rollback path.

## Scored criteria — 0, 1, or 2 points each

1. Repository map identifies entry, rules, assets, contracts, and evidence.
2. Plan sequences reversible slices with explicit checkpoints.
3. Implementation preserves domain and public API invariants.
4. Evidence includes positive, negative, boundary, authorization, and idempotency cases.
5. Claude Code extensions are used only when their value and trust boundary are justified.
6. Git history and handoff make the change understandable and recoverable.
7. Reflection identifies an assumption changed by evidence and a reusable improvement.

Suggested passing score: 11/14, with every critical criterion satisfied.
