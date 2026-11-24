# Planning guide

This directory follows the `vibe-plan` layout and holds the durable context needed to understand and continue PeerCompute (upcoming brand: ExoPute). Keep it useful and small: record information only when it will affect future work or prevent a decision from being repeated.

## What to read

For every task, read:

1. `plan/plan.md` for scope, the core conjecture, and intended outcomes.
2. `plan/todo/priority.md` for the current order of work.
3. The specific task file under `plan/todo/`, when one exists.

Read relevant files from `workflow/`, `arch/`, `test/`, `refs/`, and `log/log-summary.md` as needed. **Do not load `log/detail/` by default.** Scan relevant branch logs only when the current task may benefit from prior attempts, failures, pivots, or unresolved work, preferring targeted searches over reading entire files. This reading rule does not make detailed logging optional.

## What belongs where

- `plan.md`: user-owned scope, core conjecture, goals, non-goals, success criteria, and high-level direction. An LLM may update it only with explicit permission.
- `todo/priority.md`: a short, ordered list of the next actionable tasks.
- `todo/`: one file for work that spans multiple steps or sessions, requires meaningful decisions, or needs durable acceptance criteria. Handle small, obvious changes directly without creating a task file.
- `todo/done/`: completed task and historical branch plan files retained for reference.
- `todo/hiatus/`: paused task files that may be resumed later.
- `arch/`: cross-cutting architecture, stack choices, engineering principles, and decisions affecting more than one task. Keep editable diagram sources in `arch/diagrams/`; README-embedded PNGs stay at `arch/*.png`.
- `test/test.md`: the shared test strategy, commands, and project-wide completion expectations. Task-specific acceptance checks belong in the task file.
- `workflow/`: lightweight defaults for the development loop and trunk-based Git workflow.
- `log/log-summary.md`: concise reverse-chronological durable progress, decisions, and pivots.
- `log/detail/`: one complete prompt and development record per branch, including exact prompt timestamp, concrete actions, files touched, commands run, test results, failures, and pivots. Replace `/` in the branch name with `--` for the filename (for example, `feature/vibe-plan-and-repo-hygiene` uses `log/detail/feature--vibe-plan-and-repo-hygiene.md`). Use `log/detail/_template.md` to start a branch log.
- `refs/`: reference material that is actively used; link each reference from the plan or task that needs it.
- `reports/`: dated technical status audits and regression reports linked from README or tasks.

Use `todo/_template.md` when a task file is warranted. Delete unused template sections rather than filling them with boilerplate.

## Current and target state

When documentation describes a desired state that differs from the repository, add brief `Current state` and `Target state` sections to the relevant plan, architecture, or task file. Remove the distinction once the target is reached. Do not maintain a separate drift register.

## Maintenance

Update planning files in the same change that makes them inaccurate. Keep `todo/priority.md` short. When work finishes or pauses, move its task file into `todo/done/` or `todo/hiatus/` and remove it from the active queue. Keep branch detail logs as history; summarize durable outcomes in `log/log-summary.md`.
