export type IncidentErrorCode = "NOT_FOUND" | "FORBIDDEN" | "INVALID_TRANSITION" | "VALIDATION" | "VERSION_CONFLICT";

export class IncidentError extends Error {
  constructor(public readonly code: IncidentErrorCode, message: string) {
    super(message);
    this.name = "IncidentError";
  }
}
