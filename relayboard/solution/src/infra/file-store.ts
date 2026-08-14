import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { IncidentError } from "../domain/errors.js";
import type { IncidentRepository } from "../domain/ports.js";
import type { Incident } from "../domain/types.js";

export class FileIncidentRepository implements IncidentRepository {
  constructor(private readonly filename: string, private readonly seed: Incident[]) {}

  private async read(): Promise<Incident[]> {
    try { return JSON.parse(await readFile(this.filename, "utf8")) as Incident[]; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await mkdir(path.dirname(this.filename), { recursive: true });
      await writeFile(this.filename, JSON.stringify(this.seed, null, 2));
      return structuredClone(this.seed);
    }
  }

  private async write(incidents: Incident[]): Promise<void> {
    await mkdir(path.dirname(this.filename), { recursive: true });
    await writeFile(this.filename, JSON.stringify(incidents, null, 2) + "\n");
  }

  async get(id: string): Promise<Incident | undefined> { return (await this.read()).find((item) => item.id === id); }
  async list(): Promise<Incident[]> { return this.read(); }
  async save(incident: Incident, expectedVersion: number): Promise<Incident> {
    const incidents = await this.read();
    const index = incidents.findIndex((item) => item.id === incident.id);
    if (index < 0) throw new IncidentError("NOT_FOUND", `Incident ${incident.id} was not found.`);
    if (incidents[index]?.version !== expectedVersion) throw new IncidentError("VERSION_CONFLICT", `Expected version ${expectedVersion}.`);
    incidents[index] = structuredClone(incident);
    await this.write(incidents);
    return structuredClone(incident);
  }
}
