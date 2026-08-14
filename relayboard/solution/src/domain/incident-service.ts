import { IncidentError } from "./errors.js";
import type { AuditSink, Clock, IncidentRepository } from "./ports.js";
import { systemClock } from "./ports.js";
import type { Incident, IncidentStatus, TransitionCommand } from "./types.js";

export interface IncidentServiceOptions { escalationAgeMinutes: number; }
const defaults: IncidentServiceOptions = { escalationAgeMinutes: 30 };

export class IncidentService {
  constructor(private readonly repository: IncidentRepository, private readonly audit: AuditSink, private readonly clock: Clock = systemClock, private readonly options: IncidentServiceOptions = defaults) {}
  async list(): Promise<Incident[]> { return this.repository.list(); }

  async transition(command: TransitionCommand): Promise<Incident> {
    const current = await this.repository.get(command.incidentId);
    if (!current) throw new IncidentError("NOT_FOUND", `Incident ${command.incidentId} was not found.`);
    if (command.actor.role === "viewer") throw new IncidentError("FORBIDDEN", "Viewer role cannot change incident status.");
    if (current.version !== command.expectedVersion) throw new IncidentError("VERSION_CONFLICT", `Expected version ${command.expectedVersion}, found ${current.version}.`);

    if (current.status === "escalated" && command.targetStatus === "escalated" && current.escalationReason === command.escalationReason) return current;
    this.validateTransition(current, command);

    const next: Incident = {
      ...current,
      status: command.targetStatus,
      updatedAt: this.clock.now().toISOString(),
      version: current.version + 1,
      ...(command.targetStatus === "resolved" ? { resolutionSummary: command.resolutionSummary!.trim() } : {}),
      ...(command.targetStatus === "escalated" ? { escalationReason: command.escalationReason!.trim() } : {})
    };
    const saved = await this.repository.save(next, command.expectedVersion);
    await this.audit.append({ incidentId: saved.id, actorId: command.actor.id, action: "incident.transitioned", fromStatus: current.status, toStatus: saved.status, occurredAt: saved.updatedAt, version: saved.version });
    return saved;
  }

  private validateTransition(current: Incident, command: TransitionCommand): void {
    const allowed: Record<IncidentStatus, IncidentStatus[]> = { open: ["acknowledged"], acknowledged: ["resolved", "escalated"], escalated: ["resolved"], resolved: [] };
    if (!allowed[current.status].includes(command.targetStatus)) throw new IncidentError("INVALID_TRANSITION", `Cannot move ${current.status} to ${command.targetStatus}.`);
    if (command.targetStatus === "resolved") {
      const summary = command.resolutionSummary?.trim() || "";
      if (summary.length < 20 || summary.length > 500) throw new IncidentError("VALIDATION", "Resolution summary must contain 20–500 characters.");
    }
    if (command.targetStatus === "escalated") {
      const ageMinutes = (this.clock.now().getTime() - new Date(current.createdAt).getTime()) / 60_000;
      if (current.severity !== 1 || ageMinutes < this.options.escalationAgeMinutes) throw new IncidentError("INVALID_TRANSITION", "Incident is not eligible for escalation.");
      if ((command.escalationReason?.trim().length || 0) < 10) throw new IncidentError("VALIDATION", "Escalation reason must contain at least 10 characters.");
    }
  }
}
