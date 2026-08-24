# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing Next.js App Router, TypeScript, Tailwind CSS, and browser `localStorage` persistence.

## Users

Inferred from `README.md`; user confirmation pending. A solo operator who needs a lightweight place to capture and triage personal tasks while working in one browser.

## Product Purpose

Inferred from `README.md`; user confirmation pending. Capture tasks, mark them complete, and keep attention on the right work through priority, category, and all/active/completed filters.

## Positioning

Inferred from the implementation; user confirmation pending. A local-first, single-user task board that stays useful without an account, team backend, or multi-tenant claims.

## Operating Context

Inferred from the implementation; user confirmation pending. A quick browser session where a person adds a task, chooses priority and category, works from the active view, then checks off or removes finished work.

## Capabilities and Constraints

- Add tasks with text, priority (`high`, `medium`, `low`), and category (`work`, `personal`, `shopping`).
- Filter all, active, or completed tasks.
- Toggle completion and delete tasks.
- Persist state in browser `localStorage` only.
- Not a multi-user SaaS, synchronized task service, or payroll/enterprise workflow.

## Evidence on Hand

- Existing runnable interface in `app/page.tsx`.
- README feature list and limitations.
- No backend, account system, remote sync, or external task data is present.

## Product Principles

- Capture should be immediate.
- Priority should be legible at a glance.
- Local state should be honest and reversible.
- Filters should reduce attention cost, not add ceremony.

