import type { IncomingMessage, ServerResponse } from "node:http";
import { IncidentError } from "../domain/errors.js";
import type { IncidentService } from "../domain/incident-service.js";
import type { IncidentStatus, Role } from "../domain/types.js";

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function json(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

const statusFor = (error: IncidentError): number => ({ NOT_FOUND: 404, FORBIDDEN: 403, INVALID_TRANSITION: 409, VALIDATION: 400, VERSION_CONFLICT: 409 })[error.code];

export function createRouter(service: IncidentService) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    try {
      const url = new URL(request.url || "/", "http://relayboard.local");
      if (request.method === "GET" && url.pathname === "/api/incidents") return json(response, 200, await service.list());
      const match = url.pathname.match(/^\/api\/incidents\/([^/]+)$/);
      if (request.method === "PATCH" && match?.[1]) {
        const input = await body(request);
        const incident = await service.transition({
          incidentId: match[1],
          targetStatus: String(input.targetStatus) as IncidentStatus,
          expectedVersion: Number(input.expectedVersion),
          actor: { id: String(request.headers["x-actor-id"] || "course-user"), role: String(request.headers["x-role"] || "viewer") as Role },
          ...(typeof input.resolutionSummary === "string" ? { resolutionSummary: input.resolutionSummary } : {}),
          ...(typeof input.escalationReason === "string" ? { escalationReason: input.escalationReason } : {})
        });
        return json(response, 200, incident);
      }
      json(response, 404, { error: { code: "NOT_FOUND", message: "Route not found." } });
    } catch (error) {
      if (error instanceof IncidentError) return json(response, statusFor(error), { error: { code: error.code, message: error.message } });
      json(response, 500, { error: { code: "INTERNAL", message: "Unexpected server error." } });
    }
  };
}
