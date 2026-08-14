import type { AuditEvent, Incident } from "./types.js";

export interface IncidentRepository {
  get(id: string): Promise<Incident | undefined>;
  list(): Promise<Incident[]>;
  save(incident: Incident, expectedVersion: number): Promise<Incident>;
}

export interface AuditSink {
  append(event: AuditEvent): Promise<void>;
  list(): Promise<AuditEvent[]>;
}

export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };
