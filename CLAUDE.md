# CLAUDE.md

This file gives Claude Code (and other agents) context on the Outfit Planner project.

## What this project is

Outfit Planner is a web app for planning outfits and organizing a wardrobe. The intent is to let a user catalog clothing items, group them into outfits, and plan what to wear over time (e.g. by day or occasion). The app is in its initial scaffolding stage — no wardrobe or outfit features have been built yet.

## Tech stack

- **Next.js** (App Router) — routing and rendering
- **TypeScript**
- **Tailwind CSS** — styling
- **ESLint** — linting (`eslint-config-next`)

## Project structure

- `src/app/` — routes, layouts, and pages (App Router conventions)
- `src/app/layout.tsx` — root layout and metadata
- `src/app/page.tsx` — home page
- `src/app/globals.css` — Tailwind entry point and CSS variables (`--background`, `--foreground`)
- `public/` — static assets

As features are added, prefer colocating feature code under `src/` (e.g. `src/components/`, `src/lib/`) rather than flattening everything into `src/app/`.

## Conventions

- Use the App Router (`src/app/`), not the Pages Router.
- Use TypeScript for all source files.
- Style with Tailwind utility classes; avoid introducing a separate CSS-in-JS system.
- Keep the `@/*` import alias (configured in `tsconfig.json`) for absolute imports from `src/`.

## Commands

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # run ESLint
```
