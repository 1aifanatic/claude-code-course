import readline from "node:readline";
const incidents = [{ id: "INC-100", title: "Checkout latency", severity: 1, status: "acknowledged" }];
const tools = [{ name: "list_incidents", description: "List fictional RelayBoard course incidents. Read-only.", inputSchema: { type: "object", properties: {}, additionalProperties: false } }, { name: "get_incident", description: "Get one fictional incident by id. Read-only.", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false } }];
const send = (id, result) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "
");
readline.createInterface({ input: process.stdin }).on("line", (line) => {
  const request = JSON.parse(line);
  if (request.method === "initialize") return send(request.id, { protocolVersion: "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "relayboard-course", version: "1.0.0" } });
  if (request.method === "tools/list") return send(request.id, { tools });
  if (request.method === "tools/call") {
    const value = request.params?.name === "get_incident" ? incidents.find((item) => item.id === request.params?.arguments?.id) ?? null : incidents;
    return send(request.id, { content: [{ type: "text", text: JSON.stringify(value) }] });
  }
});
