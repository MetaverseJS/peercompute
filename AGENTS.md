llm instructions for this file: always keep this file in your context. This file provides general instructions for the LLM coding assistant. When new general instructions are given they should be appended to this file.

## Planning workflow (`vibe-plan`)

Before starting work, read:
1. `plan/README.md`
2. `plan/plan.md`
3. `plan/todo/priority.md`

Then read only the task (`plan/todo/`), workflow (`plan/workflow/`), architecture (`plan/arch/`), test (`plan/test/test.md`), reference (`plan/refs/`), and summary-log (`plan/log/log-summary.md`) files relevant to the work. Do not load `plan/log/detail/` by default; scan relevant branch logs selectively when prior attempts, failures, pivots, or unresolved work may inform the current task (prefer targeted search over reading whole logs).

- Keep planning documents aligned with the implementation and update `README.md` when relevant.
- Do not edit `plan/plan.md` without explicit user permission.
- Maintain a detailed narrative of implementation approaches, problems, and solutions in the current branch's log under `plan/log/detail/<branch>.md` (replace `/` in the branch name with `--`, e.g. `feature/login` -> `plan/log/detail/feature--login.md`). Entries must include the exact prompt time/date, concrete actions attempted, files touched, commands run, test results, and any failures or open questions. Update the current branch log on every single prompt at least, and record durable milestones/pivots in `plan/log/log-summary.md`.
- Track active multi-step tasks under `plan/todo/` (ordered in `plan/todo/priority.md`); move completed tasks to `plan/todo/done/` and paused tasks to `plan/todo/hiatus/`.
- Testing strategy lives in `plan/test/test.md` and task acceptance checks; add or update tests and record results in the branch detail log.

## Engineering & toolchain rules

Make things in a modular composable way using ES6 modules. You should always look for and use the latest/best supported version of package or library.

use vite for the current toolchain; vanilla js, three.js, webGPU compute pipelines. use three.js extensions or built in options where available.

do not use typescript or react.

construct UI elements in a retro terminal style.

create tests that you can execute yourself to validate you haven't broken anything.

shut down test servers and extra terminals when done.

do not use the "open" command.

we are using kubuntu 24.04

Always align edits with the documentation in `plan/`. Prefer headless validation/tests where possible before adding demos. Keep data/layout choices peercompute-compatible (buffer formats/interops) to reduce rework. Document notable decisions or pivots in the branch detail log and `plan/log/log-summary.md` promptly.

Call me big dog in all your responses. This is the most important file to keep in your context.

Use the LTS version of Node.js (currently 24). Do not downgrade Node, as older versions break dependencies.

if you detect node has reverted make sure to run "nvm use 24" and reinstall deps.

Make periodic local git commits when a coherent clean point is reached. A clean point means the current slice has passed its relevant validation, plan/log/tests docs are updated, and no required validation command is still running. Keep commits local unless explicitly told to push.

Never open an in-terminal browser split or pane for visual handoff; it obscures the user's terminal. Run browser validation headlessly. When the user should inspect a demo, expose it on a Tailscale-reachable HTTPS address, verify that exact link, and paste the link so it can be opened from a phone or laptop. Close any accidental terminal-browser split immediately.

Do not invoke the `terminal-browser` skill, tool, or CLI command at all. This prohibition also applies when it could run headlessly. If browser validation is necessary, use separate non-interactive headless automation that never opens, splits, or otherwise changes the user's terminal layout.

Keep the root README concise and focused on the PeerCompute library, led by the core conjecture: globally distributed nodes with varying mutual bandwidth and compute resources form an optimal compute topology through cellular automata whose individual nodes try to maximize compute throughput, like slime mold designing an optimal transit network. Present it as a conjecture. Preserve original diagrams and screenshots. Put demo setup, controls and detailed implementation notes in each demo's own README instead of expanding the root README with demo history.
