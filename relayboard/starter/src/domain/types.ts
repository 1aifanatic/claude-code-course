export type Severity = 1 | 2 | 3 | 4;
export type IncidentStatus = "open" | "acknowledged" | "escalated" | "resolved";
export type Role = "viewer" | "operator" | "admin";

export interface Actor {
  id: string;
  role: Role;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
  resolutionSummary?: string;
  escalationReason?: string;
}

export interface TransitionCommand {
  incidentId: string;
  targetStatus: IncidentStatus;
  expectedVersion: number;
  actor: Actor;
  resolutionSummary?: string;
  escalationReason?: string;
}

export interface AuditEvent {
  incidentId: string;
  actorId: string;
  action: string;
  fromStatus: IncidentStatus;
  toStatus: IncidentStatus;
  occurredAt: string;
  version: number;
}
