# Claude Code: From Task to Trusted Change

> A medium-to-advanced, hands-on course for developers who want to use Claude Code safely and effectively on real repositories.

[Launch the course](https://1aifanatic.github.io/claude-code-course/) · [Open the curriculum](#curriculum) · [Start the RelayBoard lab](relayboard/README.md)

## About the course

This independent course teaches the engineering practices that turn an AI coding session into a trusted software change: repository discovery, explicit planning, bounded implementation, verification, context management, permissions, reusable configuration, automation, and governance.

The course is designed for developers who already understand terminal workflows, Git, pull requests, and automated testing. It is not an introductory programming course and is not affiliated with or certified by Anthropic.

## What learners will be able to do

After completing the course, learners should be able to:

- Map an unfamiliar repository before changing it.
- Turn ambiguous requests into bounded, testable specifications.
- Guide Claude Code through implementation without surrendering engineering judgment.
- Control context, permissions, sandbox boundaries, and external integrations.
- Create effective `CLAUDE.md` guidance, rules, skills, subagents, and hooks.
- Use MCP servers and plugins with explicit trust boundaries.
- Run Claude Code programmatically and within CI workflows.
- Produce reviewable evidence for tests, safety decisions, and handoff.

## Course at a glance

| Item | Details |
| --- | --- |
| Level | Medium to advanced |
| Estimated time | 6–8 hours |
| Format | 16 self-paced modules with approximately 70% practical work |
| Practice project | RelayBoard, a TypeScript/Node incident-management service |
| Knowledge checks | Three-question quiz in every module |
| Practical validation | 10 required lab checkpoints |
| Final evaluation | 20-question assessment plus a capstone |
| Completion threshold | 80% assessment score and all required practical evidence |
| Hosting | Static HTML; no build process or backend required |

## Launch the course

### Online

Open the hosted application:

**https://1aifanatic.github.io/claude-code-course/**

### Directly from the repository

Download or clone the repository, then open `index.html` in a modern browser:

```bash
git clone https://github.com/1aifanatic/claude-code-course.git
cd claude-code-course
```

No package installation, server, account, database, or build command is required for the course website.

### Optional local server

Some browsers apply stricter rules to `file://` pages. If needed, serve the directory with any static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Curriculum

### Path 1 — Operate

Build disciplined habits for everyday repository work.

1. Understand the agentic loop
2. Map an unfamiliar repository
3. Write specifications and plans that constrain the work
4. Implement bounded changes
5. Verify and debug with evidence
6. Manage context and sessions
7. Control permissions and sandbox boundaries

### Path 2 — Configure

Turn effective session behavior into reusable project capabilities.

8. Design `CLAUDE.md`, rules, and memory
9. Build reusable skills
10. Delegate with subagents
11. Automate guardrails with hooks
12. Connect MCP servers and plugins safely

### Path 3 — Scale

Apply Claude Code across teams, pipelines, and governed environments.

13. Coordinate parallel work, worktrees, and Git integration
14. Run Claude Code programmatically and in CI
15. Establish governance and operational controls
16. Complete the trusted-change capstone

## RelayBoard practice project

RelayBoard is a small TypeScript/Node incident-management service created specifically for this course. The starter repository contains deliberate defects involving authorization, state transitions, validation, optimistic concurrency, and idempotency.

The lab includes:

- A failing starter implementation for guided investigation.
- Seven automated tests that describe the intended behavior.
- PowerShell and Bash setup scripts that create an isolated Git workspace.
- A reference solution for comparison after completing the exercises.
- Examples of `CLAUDE.md`, path-specific rules, a skill, a subagent, a hook, and read-only integration configuration.

Read the [RelayBoard lab guide](relayboard/README.md) before beginning practical work.

## Assessment and evidence

Course completion is deliberately evidence-based rather than click-based.

- Each lesson contains a three-question quiz.
- Ten modules require a practical RelayBoard checkpoint.
- The Engineering Evidence Log captures commands, observations, risks, and verification results.
- The final assessment contains 20 questions and requires a score of at least 80%.
- The capstone requires all critical trusted-change criteria.
- A certificate becomes available only after the completion gates are satisfied.

Evidence Log data can be exported as Markdown for a portfolio, instructor review, or team learning record.

## Requirements

Reading the course only requires a modern browser. Completing all labs requires:

- Claude Code
- Git
- Node.js 20 or newer
- npm
- PowerShell 7+ on Windows, or Bash on macOS/Linux

The course does not require a cloud account, hosted database, or paid third-party service beyond whatever Claude Code access the learner already uses.

## Repository structure

```text
.
├── index.html              # Course application entry point
├── styles.css              # Responsive design and accessibility modes
├── app.js                  # Navigation, progress, quizzes, and completion gates
├── course-config.js        # Course identity and review metadata
├── modules/                # Sixteen lesson pages
├── assessment.html         # Final knowledge assessment
├── evidence-log.html       # Local engineering evidence workspace
├── evidence-log.js         # Evidence storage and Markdown export
├── glossary.html           # Claude Code and engineering terminology
├── appendices.html         # Optional advanced topics
├── sources.html            # Official source register
├── downloads/              # Rubrics and reusable templates
└── relayboard/              # Starter app, setup scripts, and reference solution
```

## Progress, privacy, and portability

Progress, quiz results, assessment state, display preferences, and Evidence Log entries are stored in the current browser using `localStorage`.

- No learner data is sent to this repository or a course backend.
- Clearing browser storage removes local course state.
- Progress does not automatically follow the learner to another device or browser.
- Export the Evidence Log before clearing data or changing devices.
- Never enter secrets, confidential source code, personal data, or regulated information into the Evidence Log.

## Accessibility

The application includes:

- Keyboard-accessible navigation and visible focus states
- Skip links and semantic landmarks
- Responsive desktop and mobile layouts
- Multiple text-size settings
- A high-contrast mode
- Reduced-motion support
- Print-friendly lesson and certificate styles

## GitHub Pages deployment

The repository is intentionally deployable without a build pipeline:

- `index.html` is located at the repository root.
- All internal assets and navigation use relative paths.
- `.nojekyll` prevents unnecessary Jekyll processing.
- GitHub Pages can serve the `main` branch from the repository root.

## Source and maintenance policy

Claude Code changes quickly. Product-specific statements should be reviewed against the [official Claude Code documentation](https://code.claude.com/docs/en/overview) before each instructional release. The [source register](sources.html) records the official references associated with the current curriculum.

When updating the course:

1. Verify changed product behavior against primary documentation.
2. Update affected lessons, demonstrations, quizzes, and source links together.
3. Test navigation, progress storage, completion gates, and mobile layouts.
4. Run both RelayBoard test suites—the starter should fail only at the intended checkpoints, while the solution should pass.
5. Update the review metadata in `course-config.js`.

## Contributing

Issues and pull requests are welcome when they improve technical accuracy, accessibility, teaching clarity, or cross-platform behavior. Please describe:

- The learner problem being addressed.
- The affected module or lab checkpoint.
- The official source or executable evidence supporting the change.
- The validation performed after the change.

## Disclaimer

This is an independent educational project. It is not an official Anthropic course, credential, endorsement, or certification. Product names and trademarks belong to their respective owners.
