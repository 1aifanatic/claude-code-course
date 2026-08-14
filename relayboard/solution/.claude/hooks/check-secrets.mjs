let input = "";
for await (const chunk of process.stdin) input += chunk;
let payload = {};
try { payload = JSON.parse(input || "{}"); } catch { process.stderr.write("Hook input was not valid JSON.
"); process.exit(2); }
const candidate = JSON.stringify(payload.tool_input || {});
const tokenPattern = /(?:sk-ant-|ghp_|AKIA)[A-Za-z0-9_-]{8,}/;
if (tokenPattern.test(candidate)) {
  process.stderr.write("Blocked: token-like content must not be written. Use approved placeholders.
");
  process.exit(2);
}
process.exit(0);
