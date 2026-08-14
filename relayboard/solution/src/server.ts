import { createServer } from "node:http";
import path from "node:path";
import { IncidentService } from "./domain/incident-service.js";
import { createRouter } from "./http/router.js";
import { FileIncidentRepository } from "./infra/file-store.js";
import { MemoryAuditSink } from "./infra/memory-store.js";

const now = new Date();
const seed = [{ id: "INC-100", title: "Checkout latency", severity: 1 as const, status: "acknowledged" as const, createdAt: new Date(now.getTime() - 60 * 60_000).toISOString(), updatedAt: now.toISOString(), version: 1 }];
const filename = process.env.RELAYBOARD_DATA || path.resolve("data/incidents.json");
const service = new IncidentService(new FileIncidentRepository(filename, seed), new MemoryAuditSink());
const port = Number(process.env.PORT || 3030);
createServer(createRouter(service)).listen(port, () => process.stdout.write(`RelayBoard listening at http://localhost:${port}\n`));
