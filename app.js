(function () {
  "use strict";

  const CONFIG = Object.assign({
    shortTitle: "Claude Code",
    courseTitle: "Claude Code: From Task to Trusted Change",
    issuer: "Claude Code Independent Learning",
    reviewDate: "August 14, 2026",
    accentColor: "#70d6c7",
    certificateLabel: "Medium-to-Advanced Course Completion",
    moduleCount: 16,
    requiredLabCount: 10,
    assessmentPassPercent: 80
  }, window.CLAUDE_CODE_COURSE_CONFIG || {});

  const STORAGE_KEY = "claude-code-trusted-change-v1";
  const EVIDENCE_KEY = "claude-code-trusted-change-evidence-v1";
  const moduleLinks = [
    ["agentic-loop", "How Claude Code actually works", "01-agentic-loop.html"],
    ["repository-map", "Map an unfamiliar repository", "02-repository-map.html"],
    ["specification-planning", "Turn ambiguity into specifications and plans", "03-specification-planning.html"],
    ["bounded-implementation", "Implement through bounded feedback loops", "04-bounded-implementation.html"],
    ["verification-debugging", "Verify, debug, review, and recover", "05-verification-debugging.html"],
    ["context-sessions", "Control context, sessions, cost, and compaction", "06-context-sessions.html"],
    ["permissions-sandboxing", "Permissions, sandboxing, secrets, and trust boundaries", "07-permissions-sandboxing.html"],
    ["project-instructions", "Engineer effective CLAUDE.md, rules, and memory", "08-project-instructions.html"],
    ["skills", "Build reusable skills", "09-skills.html"],
    ["subagents", "Design and control subagents", "10-subagents.html"],
    ["hooks", "Automate deterministic safeguards with hooks", "11-hooks.html"],
    ["mcp-plugins", "Connect and package capabilities with MCP and plugins", "12-mcp-plugins.html"],
    ["parallel-work", "Coordinate parallel sessions, worktrees, and Git", "13-parallel-work.html"],
    ["programmatic-ci", "Run Claude Code programmatically and in CI", "14-programmatic-ci.html"],
    ["team-governance", "Establish team governance", "15-team-governance.html"],
    ["capstone", "Capstone: deliver a trusted repository change", "16-capstone.html"]
  ];
  const moduleIds = moduleLinks.map((item) => item[0]);
  const requiredLabIds = [
    "repository-map", "specification", "bounded-plan", "verification", "safety",
    "instructions", "skill", "subagent", "hook", "automation"
  ];

  function defaultState() {
    return {
      completed: [],
      labs: [],
      readerSize: "default",
      highContrast: false,
      finalPassed: false,
      finalScore: 0,
      learnerName: "",
      completionDate: "",
      capstoneReady: false
    };
  }

  function loadState() {
    try {
      return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {});
    } catch (_error) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_error) { /* local operation remains usable */ }
  }

  function rootPrefix() {
    return document.body.classList.contains("lesson-page") ? "../" : "";
  }

  function applyConfig() {
    document.querySelectorAll("[data-course-short-title]").forEach((element) => { element.textContent = CONFIG.shortTitle; });
    document.querySelectorAll("[data-course-title]").forEach((element) => { element.textContent = CONFIG.courseTitle; });
    document.querySelectorAll("[data-certificate-issuer]").forEach((element) => { element.textContent = CONFIG.issuer.toUpperCase(); });
    document.querySelectorAll("[data-review-date]").forEach((element) => { element.textContent = CONFIG.reviewDate; });
    document.documentElement.style.setProperty("--config-accent", CONFIG.accentColor);
  }

  function setReaderSize(size) {
    state.readerSize = ["default", "large", "xlarge"].includes(size) ? size : "default";
    document.body.classList.toggle("reader-large", state.readerSize === "large");
    document.body.classList.toggle("reader-xlarge", state.readerSize === "xlarge");
    document.querySelectorAll("[data-reader-size]").forEach((button) => {
      const active = button.dataset.readerSize === state.readerSize;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    saveState();
  }

  function setHighContrast(enabled) {
    state.highContrast = Boolean(enabled);
    document.body.classList.toggle("high-contrast", state.highContrast);
    document.querySelectorAll("[data-contrast-toggle]").forEach((button) => {
      button.classList.toggle("active", state.highContrast);
      button.setAttribute("aria-pressed", String(state.highContrast));
      button.textContent = state.highContrast ? "Standard" : "Contrast";
    });
    saveState();
  }

  function evidenceCount() {
    try {
      const evidence = JSON.parse(localStorage.getItem(EVIDENCE_KEY) || "{}");
      return Object.values(evidence).filter((entry) => entry && Object.values(entry).some((value) => String(value || "").trim())).length;
    } catch (_error) { return 0; }
  }

  function updateProgress() {
    const count = state.completed.filter((id) => moduleIds.includes(id)).length;
    const percent = Math.round((count / moduleIds.length) * 100);
    document.querySelectorAll("[data-progress-percent]").forEach((element) => { element.textContent = percent + "%"; });
    document.querySelectorAll("[data-progress-text]").forEach((element) => { element.textContent = count + " of " + moduleIds.length + " modules complete"; });
    document.querySelectorAll("[data-progress-fill]").forEach((element) => { element.style.width = percent + "%"; });
    document.querySelectorAll(".progress-track[role=progressbar]").forEach((element) => { element.setAttribute("aria-valuenow", String(percent)); });
    document.querySelectorAll("[data-nav-module]").forEach((link) => {
      const complete = state.completed.includes(link.dataset.navModule);
      link.classList.toggle("complete", complete);
      const number = link.querySelector("[data-nav-number]");
      const position = moduleIds.indexOf(link.dataset.navModule) + 1;
      if (number) number.textContent = complete ? "✓" : String(position).padStart(2, "0");
    });
    document.querySelectorAll("[data-lab-count]").forEach((element) => { element.textContent = state.labs.filter((id) => requiredLabIds.includes(id)).length + "/" + requiredLabIds.length; });
    document.querySelectorAll("[data-evidence-count]").forEach((element) => { element.textContent = String(evidenceCount()); });
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    if (!copied) throw new Error("Copy unavailable");
  }

  function setupCopy() {
    document.querySelectorAll("[data-copy-button]").forEach((button) => {
      button.addEventListener("click", async () => {
        const container = button.closest(".prompt-copy, .code-block");
        const source = container && container.querySelector("[data-copy-text]");
        const status = container && container.querySelector("[data-copy-status]");
        if (!source) return;
        try {
          await copyText(source.textContent || "");
          const original = button.textContent;
          button.textContent = "Copied";
          if (status) status.textContent = "Copied to your clipboard.";
          window.setTimeout(() => { button.textContent = original; }, 1600);
        } catch (_error) {
          if (status) status.textContent = "Copy was blocked. Select the text and copy it manually.";
        }
      });
    });
  }

  function setupPractice() {
    document.querySelectorAll("[data-practice]").forEach((practice) => {
      const response = practice.querySelector(".practice-response");
      const buttons = Array.from(practice.querySelectorAll(".practice-options button"));
      buttons.forEach((button) => button.addEventListener("click", () => {
        buttons.forEach((candidate) => {
          candidate.classList.remove("selected", "correct", "incorrect");
          candidate.setAttribute("aria-pressed", "false");
        });
        button.classList.add("selected", button.dataset.correct === "true" ? "correct" : "incorrect");
        button.setAttribute("aria-pressed", "true");
        if (response) {
          response.hidden = false;
          const title = response.querySelector("strong");
          const copy = response.querySelector("p");
          if (title) title.textContent = button.dataset.correct === "true" ? "Good call" : "Look again";
          if (copy) copy.textContent = button.dataset.feedback || "";
        }
      }));
    });
  }

  function selectQuizOption(button) {
    const question = button.closest("[data-question]");
    if (!question || question.dataset.locked === "true") return;
    question.querySelectorAll("[data-option]").forEach((candidate) => {
      candidate.classList.remove("selected");
      candidate.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
  }

  function gradeQuiz(container) {
    const questions = Array.from(container.querySelectorAll("[data-question]"));
    const choices = questions.map((question) => question.querySelector("[data-option].selected"));
    if (choices.some((choice) => !choice)) return { complete: false, correct: 0, total: questions.length };
    let correct = 0;
    questions.forEach((question, index) => {
      question.dataset.locked = "true";
      question.querySelectorAll("[data-option]").forEach((button) => {
        button.disabled = true;
        if (button.dataset.correct === "true") button.classList.add("correct");
      });
      if (choices[index].dataset.correct === "true") correct += 1;
      else choices[index].classList.add("incorrect");
      const explanation = question.querySelector(".quiz-explanation");
      if (explanation) explanation.hidden = false;
    });
    return { complete: true, correct, total: questions.length };
  }

  function resetQuiz(container) {
    container.querySelectorAll("[data-question]").forEach((question) => {
      delete question.dataset.locked;
      question.querySelectorAll("[data-option]").forEach((button) => {
        button.disabled = false;
        button.classList.remove("selected", "correct", "incorrect");
        button.setAttribute("aria-pressed", "false");
      });
      const explanation = question.querySelector(".quiz-explanation");
      if (explanation) explanation.hidden = true;
    });
  }

  function setupModuleQuiz() {
    const section = document.querySelector("[data-module-quiz]");
    if (!section) return;
    const quiz = section.querySelector("[data-quiz-kind=module]");
    const submit = section.querySelector("[data-submit-quiz]");
    const reset = section.querySelector("[data-reset-quiz]");
    const result = section.querySelector("[data-quiz-result]");
    if (!quiz || !submit || !reset || !result) return;
    quiz.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => selectQuizOption(button)));
    submit.addEventListener("click", () => {
      const grade = gradeQuiz(quiz);
      if (!grade.complete) { result.textContent = "Answer all three questions before checking."; return; }
      submit.hidden = true;
      if (grade.correct === grade.total) {
        const moduleId = section.dataset.moduleQuiz;
        if (moduleId === "capstone" && !state.capstoneReady) {
          result.textContent = "Knowledge check passed. Complete the critical capstone checklist above to finish the module.";
          reset.hidden = false;
          return;
        }
        if (!state.completed.includes(moduleId)) state.completed.push(moduleId);
        result.textContent = "Module complete. Progress is saved in this browser.";
        result.classList.add("passed");
        saveState();
        updateProgress();
      } else {
        result.textContent = grade.correct + " of " + grade.total + " correct. Review the explanations and try again.";
        reset.hidden = false;
      }
    });
    reset.addEventListener("click", () => {
      resetQuiz(quiz);
      result.textContent = "Choose one answer for each question.";
      result.classList.remove("passed");
      submit.hidden = false;
      reset.hidden = true;
    });
    if (state.completed.includes(section.dataset.moduleQuiz)) {
      result.textContent = "This module is complete. You may retake the knowledge check.";
      result.classList.add("passed");
    }
  }

  function setupLabCheckpoints() {
    document.querySelectorAll("[data-lab-checkpoint]").forEach((button) => {
      const id = button.dataset.labCheckpoint;
      const status = button.parentElement && button.parentElement.querySelector(".checkpoint-status");
      const render = () => {
        const done = state.labs.includes(id);
        button.classList.toggle("complete", done);
        button.textContent = done ? "Checkpoint recorded ✓" : "Record checkpoint";
        button.setAttribute("aria-pressed", String(done));
        if (status) status.textContent = done ? "Recorded locally. Include the supporting command output in your Evidence Log." : "Self-attestation: record this only after the stated test or inspection passes.";
      };
      button.addEventListener("click", () => {
        if (state.labs.includes(id)) state.labs = state.labs.filter((item) => item !== id);
        else state.labs.push(id);
        saveState();
        render();
        updateProgress();
      });
      render();
    });
  }

  function setupCapstone() {
    const zone = document.querySelector("[data-capstone-checklist]");
    if (!zone) return;
    const boxes = Array.from(zone.querySelectorAll("input[type=checkbox]"));
    const button = zone.querySelector("[data-complete-capstone]");
    const status = zone.querySelector("[data-capstone-status]");
    const render = () => {
      const all = boxes.every((box) => box.checked);
      if (button) button.disabled = !all;
      if (status) status.textContent = state.capstoneReady ? "Critical capstone criteria recorded. Pass the module knowledge check to complete the course." : (all ? "All critical criteria are checked. Record the capstone readiness decision." : "Every critical safety and verification criterion must be satisfied.");
    };
    boxes.forEach((box) => box.addEventListener("change", render));
    if (button) button.addEventListener("click", () => {
      state.capstoneReady = true;
      saveState();
      render();
    });
    render();
  }

  function assessmentMissing() {
    return {
      modules: moduleLinks.filter((item) => !state.completed.includes(item[0])),
      labs: requiredLabIds.filter((id) => !state.labs.includes(id))
    };
  }

  function formatDate(value) {
    const date = value ? new Date(value + "T12:00:00") : new Date();
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
  }

  function fitCanvasText(context, value, maxWidth, startingSize) {
    let size = startingSize;
    do { context.font = "700 " + size + "px Georgia"; size -= 2; } while (size > 28 && context.measureText(value).width > maxWidth);
  }

  function drawCertificate(name) {
    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 1273;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#eef4ef";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#13211e";
    context.lineWidth = 10;
    context.strokeRect(55, 55, 1690, 1163);
    context.strokeStyle = CONFIG.accentColor;
    context.lineWidth = 3;
    context.strokeRect(78, 78, 1644, 1117);
    context.textAlign = "center";
    context.fillStyle = "#13211e";
    context.font = "800 30px Arial";
    context.fillText(CONFIG.issuer.toUpperCase(), 900, 175);
    context.fillStyle = CONFIG.accentColor;
    context.fillRect(790, 215, 220, 6);
    context.fillStyle = "#13211e";
    context.font = "italic 78px Georgia";
    context.fillText("Certificate of Completion", 900, 345);
    context.font = "30px Arial";
    context.fillStyle = "#48615a";
    context.fillText("This certifies that", 900, 445);
    context.fillStyle = "#13211e";
    fitCanvasText(context, name, 1250, 74);
    context.fillText(name, 900, 555);
    context.font = "30px Arial";
    context.fillStyle = "#48615a";
    context.fillText("completed the practical medium-to-advanced course", 900, 640);
    context.font = "700 50px Georgia";
    context.fillStyle = "#13211e";
    context.fillText(CONFIG.courseTitle, 900, 730);
    context.font = "800 25px Arial";
    context.fillStyle = "#356f65";
    context.fillText(CONFIG.certificateLabel.toUpperCase(), 900, 795);
    context.fillStyle = "#13211e";
    context.fillRect(845, 850, 110, 110);
    context.fillStyle = CONFIG.accentColor;
    context.font = "800 28px Consolas";
    context.fillText("CC", 900, 920);
    context.strokeStyle = "#92a69f";
    context.beginPath(); context.moveTo(210, 1040); context.lineTo(1590, 1040); context.stroke();
    context.font = "24px Arial";
    context.fillStyle = "#48615a";
    context.textAlign = "left";
    context.fillText("Completed " + formatDate(state.completionDate), 220, 1092);
    context.textAlign = "right";
    context.fillText("Assessment score " + state.finalScore + "%", 1580, 1092);
    context.textAlign = "center";
    context.font = "20px Arial";
    context.fillText("Independent course completion — not an Anthropic certification", 900, 1160);
    return canvas;
  }

  function refreshCertificate() {
    const input = document.querySelector("[data-certificate-name]");
    if (!input) return;
    const name = input.value.trim();
    const previewName = document.querySelector("[data-preview-name]");
    const previewDate = document.querySelector("[data-certificate-date]");
    const previewScore = document.querySelector("[data-certificate-score]");
    if (previewName) previewName.textContent = name || "Your name";
    if (previewDate) previewDate.textContent = "Completed " + formatDate(state.completionDate);
    if (previewScore) previewScore.textContent = "Assessment " + state.finalScore + "%";
    document.querySelectorAll("[data-download-certificate], [data-print-certificate]").forEach((button) => { button.disabled = !name; });
    state.learnerName = input.value;
    saveState();
  }

  function setupCertificate() {
    const zone = document.querySelector("[data-certificate-zone]");
    if (!zone || zone.dataset.ready === "true") return;
    zone.dataset.ready = "true";
    const input = zone.querySelector("[data-certificate-name]");
    const download = zone.querySelector("[data-download-certificate]");
    const print = zone.querySelector("[data-print-certificate]");
    if (!input || !download || !print) return;
    input.value = state.learnerName || "";
    input.addEventListener("input", refreshCertificate);
    download.addEventListener("click", () => {
      const name = input.value.trim();
      if (!name) return;
      const canvas = drawCertificate(name);
      if (!canvas) return;
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.download = "claude-code-trusted-change-certificate-" + name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".png";
        link.href = URL.createObjectURL(blob);
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }, "image/png");
    });
    print.addEventListener("click", () => window.print());
    refreshCertificate();
  }

  function showCertificate() {
    const lock = document.querySelector("[data-assessment-lock]");
    const quiz = document.querySelector("[data-assessment-quiz]");
    const zone = document.querySelector("[data-certificate-zone]");
    if (lock) lock.hidden = true;
    if (quiz) quiz.hidden = true;
    if (zone) zone.hidden = false;
    setupCertificate();
  }

  function setupAssessment() {
    const lock = document.querySelector("[data-assessment-lock]");
    const section = document.querySelector("[data-assessment-quiz]");
    if (!lock || !section) return;
    if (state.finalPassed) { showCertificate(); return; }
    const missing = assessmentMissing();
    const moduleBox = lock.querySelector("[data-missing-modules]");
    const labBox = lock.querySelector("[data-missing-labs]");
    const count = lock.querySelector("[data-lock-count]");
    if (count) count.textContent = String(moduleIds.length - missing.modules.length);
    if (moduleBox) moduleBox.innerHTML = missing.modules.length ? missing.modules.map((item) => '<a href="modules/' + item[2] + '"><strong>' + item[1] + '</strong><b>→</b></a>').join("") : "<span>All modules complete ✓</span>";
    if (labBox) labBox.innerHTML = missing.labs.length ? missing.labs.map((id) => "<span>Lab checkpoint: " + id.replace(/-/g, " ") + "</span>").join("") : "<span>All required lab checkpoints recorded ✓</span>";
    if (missing.modules.length || missing.labs.length || !state.capstoneReady) return;
    lock.hidden = true;
    section.hidden = false;
    const quiz = section.querySelector("[data-quiz-kind=final]");
    const submit = section.querySelector("[data-submit-final]");
    const reset = section.querySelector("[data-reset-final]");
    const result = section.querySelector("[data-final-result]");
    if (!quiz || !submit || !reset || !result) return;
    quiz.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => selectQuizOption(button)));
    submit.addEventListener("click", () => {
      const grade = gradeQuiz(quiz);
      if (!grade.complete) { result.textContent = "Answer every question before submitting."; return; }
      const percent = Math.round((grade.correct / grade.total) * 100);
      submit.hidden = true;
      if (percent >= CONFIG.assessmentPassPercent) {
        state.finalPassed = true;
        state.finalScore = percent;
        state.completionDate = state.completionDate || new Date().toISOString().slice(0, 10);
        saveState();
        showCertificate();
      } else {
        result.textContent = percent + "%. You need " + CONFIG.assessmentPassPercent + "% to pass. Review the explanations and try again.";
        reset.hidden = false;
      }
    });
    reset.addEventListener("click", () => {
      resetQuiz(quiz);
      result.textContent = "Answer all questions.";
      submit.hidden = false;
      reset.hidden = true;
    });
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function setupAssessmentTools() {
    document.querySelectorAll("[data-download-summary]").forEach((button) => button.addEventListener("click", () => {
      const missing = assessmentMissing();
      const lines = [
        "# Claude Code course progress", "", "Generated: " + new Date().toISOString(), "",
        "## Completion", "", "- Modules: " + state.completed.length + "/" + moduleIds.length,
        "- Required lab checkpoints: " + state.labs.filter((id) => requiredLabIds.includes(id)).length + "/" + requiredLabIds.length,
        "- Evidence Log modules with notes: " + evidenceCount(), "- Capstone critical criteria: " + (state.capstoneReady ? "recorded" : "not yet recorded"),
        "- Assessment: " + (state.finalPassed ? "passed at " + state.finalScore + "%" : "not yet passed"), "",
        "## Completed modules", "", ...state.completed.map((id) => "- " + (moduleLinks.find((item) => item[0] === id) || [id, id])[1]), "",
        "## Remaining modules", "", ...missing.modules.map((item) => "- " + item[1]), "",
        "## Recorded lab checkpoints", "", ...state.labs.map((id) => "- " + id), "",
        "> This is a local self-study record, not an Anthropic credential.", ""
      ];
      downloadText("claude-code-course-progress.md", lines.join("\n"));
    }));
    document.querySelectorAll("[data-reset-progress]").forEach((button) => button.addEventListener("click", () => {
      if (!window.confirm("Reset course progress and assessment results stored in this browser? Evidence Log entries are kept.")) return;
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      window.location.reload();
    }));
  }

  function setupGlossary() {
    const input = document.querySelector("[data-glossary-search]");
    const items = Array.from(document.querySelectorAll("[data-glossary-item]"));
    const empty = document.querySelector("[data-glossary-empty]");
    if (!input || !items.length) return;
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((item) => {
        const matches = !query || item.textContent.toLowerCase().includes(query);
        item.hidden = !matches;
        if (matches) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  document.querySelectorAll("[data-reader-size]").forEach((button) => button.addEventListener("click", () => setReaderSize(button.dataset.readerSize)));
  document.querySelectorAll("[data-contrast-toggle]").forEach((button) => button.addEventListener("click", () => setHighContrast(!state.highContrast)));
  applyConfig();
  setReaderSize(state.readerSize);
  setHighContrast(state.highContrast);
  updateProgress();
  setupCopy();
  setupPractice();
  setupModuleQuiz();
  setupLabCheckpoints();
  setupCapstone();
  setupAssessmentTools();
  setupAssessment();
  setupGlossary();
})();
