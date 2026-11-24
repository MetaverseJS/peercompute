# Development workflow

Use the smallest complete loop that moves PeerCompute forward without losing important context.

## The loop

1. **Orient.** Read `plan/README.md`, `plan/plan.md`, and `plan/todo/priority.md`, then load only the files relevant to the work. Inspect live code before relying on documentation. Scan relevant branch logs under `plan/log/detail/` only when prior attempts may matter.
2. **Define the outcome.** State what should be observably true when the work is complete. Create a task file under `plan/todo/` only when the work is multi-step, spans sessions, or needs durable acceptance checks.
3. **Investigate.** Locate affected code, interfaces, tests, and constraints (using ICC for structural lookups where registered). Record current and target states only when they differ.
4. **Implement.** Make the smallest coherent change that satisfies the outcome. Keep core interfaces clean, ES6-modular, and domain-agnostic.
5. **Verify.** Run focused tests first, then broader regression/build/headless Chromium gates as warranted. Shut down all temporary test servers and browser sessions when done.
6. **Reconcile.** Update planning, architecture, testing, and workflow documents made inaccurate by the change. Update the current branch's detail log (`plan/log/detail/<branch>.md`) on every prompt with exact timestamp, actions, files touched, commands run, and results; add durable milestones to `plan/log/log-summary.md`.
7. **Integrate.** Follow `plan/workflow/version-control.md`. Keep commits local unless explicitly told to push. Report verified results, file links, and any remaining work concisely.
