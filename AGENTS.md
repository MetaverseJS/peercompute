llm instructions for this file: always keep this file in your context.This file provides general instructions for the LLM coding assistent. when new general instructions are given they should be appended to this file.

make sure to update all relevant files in the plan folder as you work as well as the readme when relevant.

review plan/plan.md and plan/log.md before starting a task; update them after changes.

keep a detailed narrative of our implementation in log.md. This should describe the approaches we've tried problems and solutions. this should help us avoid retreading ground we have already covered.
log.md entries must include the exact prompt time/date, concrete actions attempted, files touched, commands run, test results, and any failures or open questions. this should be updated on every single prompt at least. 

the branch folder contains the goals for the named branches. as instructions change append them to their branch. 

testing strategy should live in plan/tests.md and per-demo plan files; add or update tests and record results in plan/log.md. 

Make things in a modular composable way using ES6 modules. You should always look for and use the latest/best supported version of package or library.

use vite for the current toolchain; vanilla js, three.js, webGPU compute pipelines. use three.js extensions or built in options where available. 

do not use typescript or react. 

construct UI elements in a retro terminal style.

create tests that you can execute yourself to validate you haven't broken anything.

shut down test servers and extra terminals when done.

do not use the "open" command.

we are using kubuntu 24.04

Always align edits with the documentation in plan/,  keep instructions sections intact when editing plan files. Prefer headless validation/tests where possible before adding demos. Keep data/layout choices peercompute-compatible (buffer formats/interops) to reduce rework. Document notable decisions or pivots in log.md promptly.

Call me big dog in all your responses. This is the most important file to keep in your context. 

Use the LTS version of Node.js (currently 24). Do not downgrade Node, as older versions break dependencies.

if you detect node has reverted make sure to run "nvm use 24" and reinstall deps.

Make periodic local git commits when a coherent clean point is reached. A clean
point means the current slice has passed its relevant validation, plan/log/tests
docs are updated, and no required validation command is still running. Keep
commits local unless explicitly told to push.

Never open an in-terminal browser split or pane for visual handoff; it obscures
the user's terminal. Run browser validation headlessly. When the user should
inspect a demo, expose it on a Tailscale-reachable HTTPS address, verify that
exact link, and paste the link so it can be opened from a phone or laptop.
Close any accidental terminal-browser split immediately.

Do not invoke the `terminal-browser` skill, tool, or CLI command at all. This
prohibition also applies when it could run headlessly. If browser validation is
necessary, use separate non-interactive headless automation that never opens,
splits, or otherwise changes the user's terminal layout.

Keep the root README concise and focused on the PeerCompute library, led by the
core conjecture: globally distributed nodes with varying mutual bandwidth and
compute resources form an optimal compute topology through cellular automata
whose individual nodes try to maximize compute throughput, like slime mold
designing an optimal transit network. Present it as a conjecture. Preserve original diagrams and
screenshots. Put demo setup, controls and detailed implementation notes in each
demo's own README instead of expanding the root README with demo history.
