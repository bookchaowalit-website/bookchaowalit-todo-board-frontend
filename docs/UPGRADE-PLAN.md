# Upgrade plan

## Current state

Score: 8/10 (was 7/10) — priority-aware ordering now real, board logic tested, accessible controls, CI; still single-list local demo.

## Backlog

- P1: Inline edit of task text and priority.
- P2: Playwright smoke test for add / complete / clear.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Board logic moved to `lib/todos.ts` (tested): open work sorts high→low priority with completed items last (the board was "priority-aware" only by label), counts, clear completed, validated storage; hydration via `lib/use-stored-state.ts` fixes the set-state-in-effect lint error.
- Add form is a real `<form>`; checkboxes and remove buttons have task-specific labels, the hidden checkbox shows a focus ring, filters use `aria-pressed`; `TRUTH-PASS.md` test signal updated.

## Done in this pass (pass 2)

- Canonical host is config-driven: `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated, clear error on a non-http(s) value) and feeds `metadataBase`, generated `app/sitemap.ts` / `app/robots.ts` and the MCP `get_app_info` URL; removed the stale template `public/sitemap.xml` / `robots.txt` (they pointed at `bookchaowalit.com` and a `*.vercel.app` name that differs from the project URL). Tested in `lib/site.test.ts`.
- Area (category) filter: `boardView`/`countTodos` take an optional area (tested); the board has an "Area" select next to the status tabs, tab counts follow the selected area, the header keeps the overall open count.

## Done in this pass (pass 3)
- Edge-case pass on `lib/todos.ts` (regression tests in `lib/todos.test.ts`):
  - `addTodo` added a blank-looking todo for text made only of zero-width
    characters / BOM; it is now ignored like whitespace.
  - Text was cut with `slice`, leaving half an emoji at `MAX_TEXT`; the new
    `cleanText` drops the whole emoji.
  - `parseTodos` kept stored todos with repeated ids (duplicate React keys,
    one toggle flipped both); only the first is kept.
