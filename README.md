# Todo Board

Priority-aware todo board with filters.

## Features
- Add / complete / delete todos
- Priority + category
- Filter all/active/completed; open work sorted by priority, completed items sink
- Clear completed
- localStorage persistence

## Limitations
- Single user local demo

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- localStorage persistence

## Run
```bash
npm install
npm run dev
```

## Honesty notes
- Portfolio mini-app showcase
- Not multi-tenant SaaS

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).
