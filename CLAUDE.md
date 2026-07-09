# MIORA WEB — CLAUDE.md

Guidance for Claude (or any agent) working in this repository.

## What this is

The marketing/portfolio site for **MIORA WEB**, a web design studio. The site
shows only one thing: a grid of past projects, each with its own detail page.
Target audience is independent hospitality businesses (hotels, cafes,
restaurants) evaluating the studio's work, so the design bar is "boutique
agency," not "SaaS dashboard." No blog, no pricing tables, no marketing fluff
beyond a hero and a contact line.

## Monorepo layout

```
mioraweb/
├── apps/
│   ├── web/   React + TypeScript (Vite), the public site
│   └── cms/   Strapi (TypeScript), the backoffice used to add/edit projects
├── pnpm-workspace.yaml
├── turbo.json
└── package.json   (root scripts fan out to both apps via Turborepo)
```

Package manager is **pnpm** (workspaces). Task runner is **Turborepo**.
Run everything from the repo root:

```bash
pnpm install          # once
pnpm dev              # runs apps/web and apps/cms in parallel
pnpm dev:web          # web only (http://localhost:5173)
pnpm dev:cms          # cms only (http://localhost:1337/admin)
pnpm build            # builds both apps
```

Each app also works standalone with its own `pnpm dev` / `pnpm build` from
inside `apps/web` or `apps/cms`.

## apps/web (the site)

- Vite + React 19 + TypeScript, **no Next.js** — this is a static SPA, there's
  no server-rendering requirement since content is public and cacheable.
- Routing: `react-router-dom`. Two routes: `/` (home + project grid) and
  `/projects/:slug` (project detail).
- Styling: Tailwind CSS v4 (`@tailwindcss/vite` plugin, config lives inline in
  `src/index.css` via `@theme`). No separate `tailwind.config.ts` — v4 doesn't
  need one for this project's scope.
- Data: fetched client-side from Strapi's REST API. See `src/lib/strapi.ts`
  for the fetch helpers and `src/types/project.ts` for the shape of a
  `Project`. Strapi v5 returns flat entities (no `.attributes` nesting).
- Env: `VITE_STRAPI_URL` (see `apps/web/.env.example`) points at the CMS.
  Defaults to `http://localhost:1337` for local dev.

### Brand

- Default palette: `#FFFFFF` (paper), `#E4E1D9` (linen — section
  backgrounds, card placeholders), `#000000` (ink — text, buttons, borders
  at low opacity). Intentionally just these three by default. No added
  accent color: the studio's own site should read as calm and monochrome so
  the *project photography* does the visual work, not the UI chrome. Muted
  text/borders are black at reduced opacity rather than a separate gray, so
  the palette stays internally consistent.
- Default type: **Fraunces** (serif, display/headings) paired with
  **Inter** (sans, body/UI). Both linked in `index.html` as the no-JS
  fallback.
- All of the above (colors, both fonts, logo, footer copy) are editable
  live from Strapi's Site Settings single type — see the `apps/cms` section
  below. Don't hardcode a new color/font elsewhere in `apps/web`; route it
  through `SiteSettings` instead, or the CMS-editability breaks silently.
- Keep layouts generous on whitespace and let images breathe — this is an
  editorial/hospitality aesthetic (think boutique hotel brochure), not a
  dense SaaS UI.

## apps/cms (Strapi backoffice)

- Strapi 5, TypeScript, SQLite for local dev (file at `apps/cms/.tmp/data.db`,
  gitignored). Swap to Postgres in production via env vars — see
  `apps/cms/.env.example` and `config/database.ts` (already reads
  `DATABASE_CLIENT` / `DATABASE_URL`).
- Content model: a collection type, `api::project.project`
  (`apps/cms/src/api/project/`). Fields: `title`, `slug` (uid from title),
  `summary`, `description` (richtext), `category` (enum), `client`,
  `location`, `year`, `websiteUrl`, `cover` (single image, required),
  `gallery` (multiple images), `featured` (bool), `order` (int, for manual
  sort — the frontend requests `sort=order:asc`).
- Plus a single type, `api::site-setting.site-setting`
  (`apps/cms/src/api/site-setting/`), for everything the studio should be
  able to change without a code deploy: `siteName`, `logo` (optional image —
  header falls back to a text wordmark split on the first space when unset),
  `headingFont` / `bodyFont` (Google Font family names), `colorPaper` /
  `colorLinen` / `colorInk` (hex strings), `footerTagline`, `footerEmail`,
  `footerInstagramUrl`, `footerLinkedinUrl`. `draftAndPublish` is off for
  this one — edits go live on Save, no publish step. The frontend
  (`src/lib/SiteSettingsContext.tsx`) fetches it once, overrides the
  `--color-*`/`--font-*` CSS custom properties on `:root` at runtime (Tailwind
  v4's utilities reference those vars directly, so this "just works" without
  a rebuild), and lazily injects a Google Fonts `<link>` for any font that
  isn't Fraunces/Inter. Bootstrap seeds a default entry matching the
  original hardcoded design so nothing breaks before someone edits it.
- Public read access: `src/index.ts` bootstrap function grants the `public`
  role `find`/`findOne` permissions on `project`, and `find` on
  `site-setting`, automatically on first boot, so the frontend can hit the
  API without an API token. Do not
  remove this — without it every fresh Strapi instance starts with the API
  locked down and the site shows nothing.
- Adding a project is entirely an admin-panel task (`/admin` →
  Content Manager → Project). No frontend deploy needed to publish new work.

### Known gotcha (already fixed here, don't reintroduce it)

Strapi's generated `.env` ships `DATABASE_FILENAME=` (empty string). Strapi's
`env()` helper treats an empty string as "explicitly set" rather than falling
back to its default, so the sqlite filename resolves to a directory instead
of a file and the app fails to boot with a cryptic `SqliteError: unable to
open database file`. Keep `DATABASE_FILENAME=.tmp/data.db` explicit in
`.env` for local/sqlite setups.

## Deployment (free-tier friendly, target audience is small local businesses)

- **apps/web** → Vercel. Root Directory = `apps/web`, framework preset Vite.
  Set `VITE_STRAPI_URL` to the deployed CMS URL in Vercel's project env vars.
  `apps/web/vercel.json` has the SPA rewrite so client-side routes don't 404
  on refresh.
- **apps/cms** → Render (or Railway/Fly) free tier. Root Directory =
  `apps/cms`. Build command `pnpm build`, start command `pnpm start`. Set
  `DATABASE_CLIENT=postgres` + `DATABASE_URL` (a free Postgres from
  Supabase or Neon — Render's free web services have an ephemeral
  filesystem, so SQLite does not persist between deploys/restarts there).
  Set `FRONTEND_URL` to the Vercel URL so CORS allows the site to fetch data.
  Free-tier CMS hosts spin down when idle; the first admin request after
  idle will be slow to wake up. That's expected and fine for this project's
  traffic level.

## Conventions

- TypeScript everywhere, strict mode as scaffolded (`noUnusedLocals`,
  `noUnusedParameters` are on in `apps/web` — keep imports clean).
- No comments explaining *what* code does; only *why*, and only when it's
  non-obvious (see the `.env` gotcha above for the kind of thing worth a
  comment).
- Don't add pages/sections beyond "showcase projects" without being asked —
  the whole point of this site is to stay small and fast to browse.
