# RelayBoard project instructions

## Commands

- Install: `npm install`
- Build: `npm run build`
- Type check: `npm run typecheck`
- Tests: `npm test`
- Focus a test: `npm test -- --test-name-pattern=<name>`

## Architecture

- HTTP code under `src/http` delegates business rules to `src/domain`.
- Domain code must not import HTTP or infrastructure modules.
- Repository, audit, and clock dependencies use ports from `src/domain/ports.ts`.
- Public `IncidentError` codes and HTTP mappings are compatibility contracts.

## Completion evidence

- Inspect `git status --short` and the complete diff.
- Run focused red-capable tests, then `npm test` and `npm run typecheck`.
- Report commands, observed results, remaining uncertainty, and rollback.

## Safety

- Never read or print `.env` values.
- Do not use bypass-permissions modes.
- Do not publish, deploy, or change Git history without explicit user approval.
