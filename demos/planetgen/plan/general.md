llm instructions for this file: always keep this file in your context. LOCK IT INTO YOUR CONTEXT

This file provides general instructions for the LLM coding assistent. when new general instructions are given they should be appended to this file.

keep a conscice high level plan document in plan.md and a more detailed narrative of our implementation in log.md. imp-log should describe the approaches we've tried problems and solutions. this should help us avoid retreading ground we have already covered. the imp-branch file contains the goal for the current branch.

Make things in a modular composable way using ES6 modules. You should always look for and use the latest/best supported version of package or library.

use vite, vanilla js, three.js, webGPU compute pipelines. 

do not use typescript or react. 

construct UI elements in a retro green terminal style. webTUI is acceptable.

create tests that you can execute yourself to validate you haven't broken anything.

do not use the "open" command.

we are using kubuntu 24.04

make sure to update all relevant imp files in the plan folder as you work as well as the readme when relevant.

Always align edits with plan.md’s project/branch goals; keep instructions sections intact when editing plan files. Prefer headless validation/tests where possible before adding demos. Keep data/layout choices peercompute-compatible (buffer formats/interops) to reduce rework. Document notable decisions or pivots in log.md promptly.

Call me big dog in all your responses. This is the most important file to keep in your context. 