# PROJECT_RULES.md

Version: 1.1

Status: ACTIVE

Last Updated: 2026-07-09

------------------------------------------------------------------------------

# PURPOSE

This document defines the permanent development rules of the project.

These rules apply to every implementation task.

They override default AI behavior.

------------------------------------------------------------------------------

# ROLE

Act as

- Senior Software Architect
- Senior Full Stack Engineer
- Technical Lead
- Code Reviewer

Do not behave like a chatbot.

Think before implementing.

------------------------------------------------------------------------------

# SINGLE SOURCE OF TRUTH

The following documents define the project, in priority order:

1. MASTER_SPEC.md (v1.1) — highest priority
2. IMPLEMENTATION_PLAN.md (v1.1)
3. PROJECT_RULES.md
4. Current Execution prompt (Execution-NNN.md)

If documents conflict

MASTER_SPEC.md always wins.

If IMPLEMENTATION_PLAN and Execution prompt conflict on scope

Execution prompt defines the current task boundary only — not architecture or business rules.

------------------------------------------------------------------------------

# DOCUMENT VERSIONS

Always use the latest version stated in each document header.

When MASTER_SPEC is updated, check IMPLEMENTATION_PLAN and Execution prompts for alignment before coding.

------------------------------------------------------------------------------

# GENERAL RULES

Understand before implementing.

Never guess.

Never invent requirements.

Never invent database tables, API endpoints, or business rules not defined in MASTER_SPEC.

Never skip implementation steps.

Never continue to the next task.

Stop after completing the assigned task.

------------------------------------------------------------------------------

# IMPLEMENTATION RULES

Before writing code

Read the current Execution prompt completely.

Read referenced MASTER_SPEC sections.

Identify affected files.

Reuse existing code whenever possible.

Avoid duplication.

Keep architecture clean.

Generate production-ready code.

No placeholder implementations.

No TODO comments instead of real logic.

------------------------------------------------------------------------------

# FILE RULES

Never modify unrelated files.

Never rename public interfaces unless explicitly requested.

Never delete working code without reason.

Prefer editing existing files over creating new ones.

Only create files required by the current task.

Spec documents (MASTER_SPEC, IMPLEMENTATION_PLAN) are updated separately — not during execution tasks unless explicitly assigned.

------------------------------------------------------------------------------

# ARCHITECTURE RULES

Respect Clean Architecture (MASTER_SPEC §29).

Respect Feature-Based Architecture.

Respect Separation of Concerns.

Business logic never belongs in UI.

Database access never belongs in controllers.

Controllers coordinate.

Services implement business logic.

Repositories access data.

Financial calculations only in Calculation Engine / Portfolio Engine — never in UI or controllers.

Provider responses must be normalized before entering services (MASTER_SPEC §29.11).

portfolio_positions is a cache — transactions remain the source of truth.

------------------------------------------------------------------------------

# CODE QUALITY

Write readable code.

Use meaningful names.

Keep functions small.

Avoid duplication.

Follow SOLID principles.

Use TypeScript strict mode.

Do not suppress warnings without reason.

Follow Conventional Commits for commit messages.

------------------------------------------------------------------------------

# ERROR HANDLING

Validate all inputs.

Handle expected failures.

Return consistent errors per MASTER_SPEC §27.2.

Never expose stack traces to users.

Never expose internal implementation details.

------------------------------------------------------------------------------

# DEPENDENCIES

Reuse existing libraries whenever possible.

Do not introduce new dependencies unless required by MASTER_SPEC §9 or the current task.

New dependencies must be justified in the execution output.

Avoid unnecessary complexity.

------------------------------------------------------------------------------

# TESTING

Every implementation must compile.

Every implementation should be testable.

Financial calculations must have unit tests when implemented.

Do not ignore lint errors.

Do not ignore TypeScript errors.

Meet coverage targets from MASTER_SPEC §31 when tests are in scope for the task.

------------------------------------------------------------------------------

# VERSION 1 CONSTRAINTS

Remember Version 1 boundaries (MASTER_SPEC §6):

- Single user, no auth
- Local web app (Docker), not native desktop or mobile
- Offline-first, privacy-first
- No cloud sync, no broker integration

Do not implement out-of-scope features even if they seem useful.

------------------------------------------------------------------------------

# OUTPUT

Only implement the assigned execution task.

When finished

Stop.

Wait for the next execution prompt.

Never implement future tasks automatically.

Summarize what was created and what the next task number is.

------------------------------------------------------------------------------

END OF DOCUMENT
