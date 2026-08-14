import { IncidentError } from "./errors.js";
import type { AuditSink, Clock, IncidentRepository } from "./ports.js";
import { systemClock } from "./ports.js";
import type { Incident, TransitionCommand } from "./types.js";

export class IncidentService {
  constructor(private readonly repository: IncidentRepository, private readonly audit: AuditSink, private readonly clock: Clock = systemClock) {}
  async list(): Promise<Incident[]> { return this.repository.list(); }

  async transition(command: TransitionCommand): Promise<Incident> {
    const current = await this.repository.get(command.incidentId);
    if (!current) throw new IncidentError("NOT_FOUND", `Incident ${command.incidentId} was not found.`);

    // COURSE DEFECTS: authorization, transition policy, validation, version handling,
    // escalation eligibility, and idempotency are intentionally incomplete.
    const next: Incident = {
      ...current,
      status: command.targetStatus,
      updatedAt: this.clock.now().toISOString(),
      version: current.version + 1,
      ...(command.resolutionSummary ? { resolutionSummary: command.resolutionSummary } : {}),
      ...(command.escalationReason ? { escalationReason: command.escalationReason } : {})
    };
    const saved = await this.repository.save(next, current.version);
    await this.audit.append({ incidentId: saved.id, actorId: command.actor.id, action: "incident.transitioned", fromStatus: current.status, toStatus: saved.status, occurredAt: saved.updatedAt, version: saved.version });
    return saved;
  }
}
