import assert from "node:assert/strict";
import test from "node:test";
import { IncidentError } from "../src/domain/errors.js";
import { IncidentService } from "../src/domain/incident-service.js";
import type { Clock } from "../src/domain/ports.js";
import type { Incident } from "../src/domain/types.js";
import { MemoryAuditSink, MemoryIncidentRepository } from "../src/infra/memory-store.js";

const now = new Date("2026-08-14T12:00:00Z");
const clock: Clock = { now: () => now };
const incident = (overrides: Partial<Incident> = {}): Incident => ({ id: "INC-100", title: "Checkout latency", severity: 1, status: "acknowledged", createdAt: "2026-08-14T10:00:00Z", updatedAt: "2026-08-14T11:00:00Z", version: 2, ...overrides });
const setup = (value: Incident = incident()) => { const repository = new MemoryIncidentRepository([value]); const audit = new MemoryAuditSink(); return { repository, audit, service: new IncidentService(repository, audit, clock) }; };

test("operator can acknowledge an open incident", async () => {
  const { service } = setup(incident({ status: "open", version: 1 }));
  const result = await service.transition({ incidentId: "INC-100", targetStatus: "acknowledged", expectedVersion: 1, actor: { id: "op-1", role: "operator" } });
  assert.equal(result.status, "acknowledged");
});

test("viewer is forbidden from changing status", async () => {
  const { service } = setup();
  await assert.rejects(() => service.transition({ incidentId: "INC-100", targetStatus: "resolved", expectedVersion: 2, actor: { id: "view-1", role: "viewer" }, resolutionSummary: "Latency returned to normal after cache recovery." }), (error: unknown) => error instanceof IncidentError && error.code === "FORBIDDEN");
});

test("invalid transition is rejected", async () => {
  const { service } = setup(incident({ status: "open", version: 1 }));
  await assert.rejects(() => service.transition({ incidentId: "INC-100", targetStatus: "resolved", expectedVersion: 1, actor: { id: "op-1", role: "operator" }, resolutionSummary: "Invalid direct transition must never persist." }), (error: unknown) => error instanceof IncidentError && error.code === "INVALID_TRANSITION");
});

test("resolution requires a meaningful summary", async () => {
  const { service } = setup();
  await assert.rejects(() => service.transition({ incidentId: "INC-100", targetStatus: "resolved", expectedVersion: 2, actor: { id: "op-1", role: "operator" }, resolutionSummary: "fixed" }), (error: unknown) => error instanceof IncidentError && error.code === "VALIDATION");
});

test("stale expected version is rejected", async () => {
  const { service } = setup();
  await assert.rejects(() => service.transition({ incidentId: "INC-100", targetStatus: "resolved", expectedVersion: 1, actor: { id: "op-1", role: "operator" }, resolutionSummary: "Latency returned to normal after cache recovery." }), (error: unknown) => error instanceof IncidentError && error.code === "VERSION_CONFLICT");
});

test("eligible P1 incident can be escalated", async () => {
  const { service } = setup();
  const result = await service.transition({ incidentId: "INC-100", targetStatus: "escalated", expectedVersion: 2, actor: { id: "op-1", role: "operator" }, escalationReason: "Customer checkout is materially degraded." });
  assert.equal(result.status, "escalated");
});

test("repeating the same escalation is idempotent", async () => {
  const existing = incident({ status: "escalated", escalationReason: "Customer checkout is materially degraded.", version: 3 });
  const { service, audit } = setup(existing);
  const result = await service.transition({ incidentId: "INC-100", targetStatus: "escalated", expectedVersion: 3, actor: { id: "op-1", role: "operator" }, escalationReason: "Customer checkout is materially degraded." });
  assert.equal(result.version, 3);
  assert.equal((await audit.list()).length, 0);
});
