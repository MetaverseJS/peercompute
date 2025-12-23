llm instructions for this file: always keep this file in your context.This file provides general instructions for the LLM coding assistent. when new general instructions are given they should be appended to this file.

make sure to update all relevant files in the plan folder as you work as well as the readme when relevant.

review plan/plan.md and plan/log.md before starting a task; update them after changes.

a more detailed narrative of our implementation in log.md. log should describe the approaches we've tried problems and solutions. this should help us avoid retreading ground we have already covered.

the branch file contains the goal for the current branch. as instructions change append them to this branch. 

the test.md file contains a unit and integration testing strategy. 

Make things in a modular composable way using ES6 modules. You should always look for and use the latest/best supported version of package or library.

use webpack 5 for the current toolchain; vanilla js, three.js, webGPU compute pipelines. use three.js extensions or built in options where available. 

do not use typescript or react. 

construct UI elements in a retro terminal style.

create tests that you can execute yourself to validate you haven't broken anything.

shut down test servers and extra terminals when done.

do not use the "open" command.

we are using kubuntu 24.04

Always align edits with the documentation in plan/,  keep instructions sections intact when editing plan files. Prefer headless validation/tests where possible before adding demos. Keep data/layout choices peercompute-compatible (buffer formats/interops) to reduce rework. Document notable decisions or pivots in log.md promptly.

Call me big dog in all your responses. This is the most important file to keep in your context. 
