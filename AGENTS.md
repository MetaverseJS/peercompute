llm instructions for this file: always keep this file in your context.This file provides general instructions for the LLM coding assistent. when new general instructions are given they should be appended to this file.

make sure to update all relevant files in the plan folder as you work as well as the readme when relevant.

review plan/plan.md and plan/log.md before starting a task; update them after changes.

keep a detailed narrative of our implementation in log.md. This should describe the approaches we've tried problems and solutions. this should help us avoid retreading ground we have already covered.
log.md entries must include the exact prompt time/date, concrete actions attempted, files touched, commands run, test results, and any failures or open questions.

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
