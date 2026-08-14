import { IncidentError } from "../domain/errors.js";
import type { AuditSink, IncidentRepository } from "../domain/ports.js";
import type { AuditEvent, Incident } from "../domain/types.js";

const clone = <T>(value: T): T => structuredClone(value);

export class MemoryIncidentRepository implements IncidentRepository {
  private readonly incidents = new Map<string, Incident>();

  constructor(seed: Incident[] = []) {
    seed.forEach((incident) => this.incidents.set(incident.id, clone(incident)));
  }

  async get(id: string): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    return incident ? clone(incident) : undefined;
  }

  async list(): Promise<Incident[]> {
    return [...this.incidents.values()].map(clone);
  }

  async save(incident: Incident, expectedVersion: number): Promise<Incident> {
    const current = this.incidents.get(incident.id);
    if (!current) throw new IncidentError("NOT_FOUND", `Incident ${incident.id} was not found.`);
    if (current.version !== expectedVersion) {
      throw new IncidentError("VERSION_CONFLICT", `Expected version ${expectedVersion}, found ${current.version}.`);
    }
    const saved = clone(incident);
    this.incidents.set(saved.id, saved);
    return clone(saved);
  }
}

export class MemoryAuditSink implements AuditSink {
  private readonly events: AuditEvent[] = [];
  async append(event: AuditEvent): Promise<void> { this.events.push(clone(event)); }
  async list(): Promise<AuditEvent[]> { return this.events.map(clone); }
}
