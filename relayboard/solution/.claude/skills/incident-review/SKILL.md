---
name: incident-review
description: Review changes to RelayBoard incident behavior for domain invariants and verification evidence. Use after incident domain, HTTP, persistence, or test changes.
---

Read `references/domain-invariants.md`. Inspect the complete Git diff and the relevant tests.

Return:

1. **Blockers** — violated invariants, authorization gaps, compatibility breaks, or missing red-capable evidence.
2. **Evidence gaps** — claims that are not yet supported by tests or inspection.
3. **Suggestions** — non-blocking maintainability improvements.

Remain read-only. Do not edit, approve, merge, or publish the change.
