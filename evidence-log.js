(function () {
  "use strict";

  const STORAGE_KEY = "claude-code-trusted-change-evidence-v1";
  const modules = [
    "How Claude Code actually works",
    "Map an unfamiliar repository",
    "Turn ambiguity into specifications and plans",
    "Implement through bounded feedback loops",
    "Verify, debug, review, and recover",
    "Control context, sessions, cost, and compaction",
    "Permissions, sandboxing, secrets, and trust boundaries",
    "Engineer effective CLAUDE.md, rules, and memory",
    "Build reusable skills",
    "Design and control subagents",
    "Automate deterministic safeguards with hooks",
    "Connect and package capabilities with MCP and plugins",
    "Coordinate parallel sessions, worktrees, and Git",
    "Run Claude Code programmatically and in CI",
    "Establish team governance",
    "Capstone: deliver a trusted repository change"
  ];
  const fields = [
    ["frame", "Task frame and success criteria"],
    ["risk", "Risk, authority, and permission choices"],
    ["commands", "Commands, tests, or inspections run"],
    ["evidence", "Evidence observed and conclusion"],
    ["reflection", "What I would change next time"]
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; }
    catch (_error) { return {}; }
  }

  let data = load();
  const container = document.querySelector("[data-evidence-modules]");
  const status = document.querySelector("[data-evidence-status]");

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (status) status.textContent = "Saved locally at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".";
    } catch (_error) {
      if (status) status.textContent = "Browser storage is unavailable. Export before leaving this page.";
    }
    updateSummary();
  }

  function entryHasContent(entry) {
    return entry && Object.values(entry).some((value) => String(value || "").trim());
  }

  function updateSummary() {
    const count = modules.filter((_title, index) => entryHasContent(data[index + 1])).length;
    const countElement = document.querySelector("[data-evidence-filled]");
    const progress = document.querySelector("[data-evidence-progress]");
    if (countElement) countElement.textContent = count + "/" + modules.length;
    if (progress) progress.textContent = count === modules.length ? "Every module contains evidence." : (modules.length - count) + " modules still have no evidence.";
    document.querySelectorAll(".evidence-card").forEach((card) => {
      const index = Number(card.dataset.moduleIndex);
      const marker = card.querySelector("summary small");
      if (marker) marker.textContent = entryHasContent(data[index]) ? "Notes saved ✓" : "Not started";
    });
  }

  function render() {
    if (!container) return;
    container.innerHTML = modules.map((title, index) => {
      const moduleNumber = index + 1;
      const entry = data[moduleNumber] || {};
      return '<details class="evidence-card" data-module-index="' + moduleNumber + '">' +
        '<summary><span>' + String(moduleNumber).padStart(2, "0") + '</span><strong>' + title + '</strong><small>' + (entryHasContent(entry) ? "Notes saved ✓" : "Not started") + '</small></summary>' +
        '<div class="evidence-fields">' + fields.map(([key, label]) =>
          '<label>' + label + '<textarea data-evidence-field="' + key + '" placeholder="Record concrete evidence, not a general impression.">' + escapeHtml(entry[key] || "") + '</textarea></label>'
        ).join("") + '</div></details>';
    }).join("");
    container.querySelectorAll("textarea").forEach((area) => area.addEventListener("input", () => {
      const card = area.closest("[data-module-index]");
      if (!card) return;
      const index = Number(card.dataset.moduleIndex);
      data[index] = data[index] || {};
      data[index][area.dataset.evidenceField] = area.value;
      save();
    }));
    updateSummary();
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function markdown() {
    const lines = [
      "# Claude Code Engineering Evidence Log", "", "Exported: " + new Date().toISOString(), "",
      "> This log records observations and decisions. Replace self-reported claims with links, diffs, test output, or review evidence when available.", ""
    ];
    modules.forEach((title, index) => {
      const entry = data[index + 1] || {};
      lines.push("## " + String(index + 1).padStart(2, "0") + ". " + title, "");
      fields.forEach(([key, label]) => lines.push("### " + label, "", String(entry[key] || "_Not recorded._"), ""));
    });
    lines.push("## Capstone evidence index", "", "- Change request or issue:", "- Specification:", "- Plan:", "- Diff or pull request:", "- Automated test output:", "- Manual verification:", "- Security review:", "- Rollback or recovery note:", "- Final reviewer decision:", "");
    return lines.join("\n");
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  const exportButton = document.querySelector("[data-export-evidence]");
  if (exportButton) exportButton.addEventListener("click", () => {
    download("claude-code-engineering-evidence-log.md", markdown());
    if (status) status.textContent = "Markdown evidence log exported.";
  });

  const clearButton = document.querySelector("[data-clear-evidence]");
  if (clearButton) clearButton.addEventListener("click", () => {
    if (!window.confirm("Clear every Evidence Log entry stored in this browser? Export first if you may need it.")) return;
    data = {};
    try { localStorage.removeItem(STORAGE_KEY); } catch (_error) { /* ignore */ }
    render();
    if (status) status.textContent = "Evidence Log cleared.";
  });

  render();
})();
