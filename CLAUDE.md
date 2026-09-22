# CLAUDE.md

This file gives Claude Code (and other agents) context on the Outfit Planner project.

## What this project is

Outfit Planner is a web app that recommends outfits based on real-world conditions. A user provides **age, location, occasion, and date**; the app fetches weather for that location/date, uses AI to generate outfit recommendations, and then dynamically finds real clothing products matching those recommendations.

Flow: **input form → weather lookup → AI-generated outfits → product search → product cards**.

The app is in its initial scaffolding stage — none of the above features have been built yet.

## Tech stack

- **Next.js** (App Router) — routing and rendering
- **TypeScript**
- **Tailwind CSS** — styling
- **ESLint** — linting (`eslint-config-next`)
- **Weather**: [Open-Meteo](https://open-meteo.com) (free, no API key required)
- **AI recommendations**: Claude API — returns structured JSON (outfit descriptions + product search queries)
- **Products**: a real-time product search API (start with a free-tier Google Shopping-style API on RapidAPI) — no hard-coded product data

## Key rules

- **Everything dynamic** — no hard-coded product lists or canned outfit data. Weather, AI outfits, and products are all fetched live.
- **Mobile-first, responsive** design.
- **Clean, modern UI.**
- **MVP first** — build only: input form → weather → AI outfits → product cards. Don't build wardrobe cataloging, accounts, or persistence until the MVP works end to end.
- **All API keys via environment variables** (`.env.local`, never committed). Access server-side secrets only in server code (Route Handlers / Server Components / Server Actions), never expose them to the client.

## Project structure

- `src/app/` — routes, layouts, and pages (App Router conventions)
- `src/app/layout.tsx` — root layout and metadata
- `src/app/page.tsx` — home page (outfit request form)
- `src/app/api/` — Route Handlers for server-side calls to weather, Claude, and product search APIs
- `src/app/globals.css` — Tailwind entry point and CSS variables (`--background`, `--foreground`)
- `public/` — static assets

As features are added, prefer colocating feature code under `src/` (e.g. `src/components/`, `src/lib/`) rather than flattening everything into `src/app/`.

## Conventions

- Use the App Router (`src/app/`), not the Pages Router.
- Use TypeScript for all source files.
- Style with Tailwind utility classes; avoid introducing a separate CSS-in-JS system.
- Keep the `@/*` import alias (configured in `tsconfig.json`) for absolute imports from `src/`.
- Call third-party APIs (weather, Claude, product search) from server-side code (Route Handlers or Server Actions) so API keys never reach the client.
- Validate and type external API responses at the boundary rather than trusting raw JSON throughout the app.

## Commands

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # run ESLint
```
