# RelayBoard architecture

HTTP requests enter through `src/http/router.ts` and delegate business decisions to `IncidentService`. The service depends on repository, audit, and clock ports. Infrastructure adapters provide memory and JSON-file storage. Public error codes are compatibility contracts.

## Commands

- `npm test` — compile and run all tests
- `npm run typecheck` — type check without output
- `npm start` — compile and serve the local API
