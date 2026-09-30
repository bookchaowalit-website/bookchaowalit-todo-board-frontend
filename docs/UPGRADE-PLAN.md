# Upgrade plan

## Current state

Score: 7/10 (was 5/10) — priority-aware ordering now real, board logic tested, accessible controls, CI; still single-list local demo.

## Backlog

- P1: Inline edit of task text and priority.
- P1: Category filter (categories are captured but not filterable).
- P2: Playwright smoke test for add / complete / clear.
- P2: Correct `public/sitemap.xml` host.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Board logic moved to `lib/todos.ts` (tested): open work sorts high→low priority with completed items last (the board was "priority-aware" only by label), counts, clear completed, validated storage; hydration via `lib/use-stored-state.ts` fixes the set-state-in-effect lint error.
- Add form is a real `<form>`; checkboxes and remove buttons have task-specific labels, the hidden checkbox shows a focus ring, filters use `aria-pressed`; `TRUTH-PASS.md` test signal updated.
