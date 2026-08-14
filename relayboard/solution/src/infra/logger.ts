export interface LogRecord { level: "info" | "warn" | "error"; event: string; incidentId?: string; actorId?: string; detail?: string; }
export const log = (record: LogRecord): void => {
  process.stdout.write(JSON.stringify({ timestamp: new Date().toISOString(), ...record }) + "\n");
};
