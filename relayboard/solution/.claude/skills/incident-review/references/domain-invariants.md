# Domain invariants

- Viewers may read incidents but never change status.
- Every mutation uses an expected version and fails on stale state.
- Resolved incidents include a 20–500 character resolution summary.
- Only acknowledged P1 incidents old enough for the configured threshold may escalate.
- Repeating the same escalation request is idempotent and emits no duplicate audit event.
- Public IncidentError codes and HTTP status mappings remain stable.
