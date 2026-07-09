# MIORA WEB

Portfolio site for **MIORA WEB**, a web design studio. It showcases past
projects — nothing else. Built for a small, targeted audience (hotels,
cafes, and other independent hospitality businesses) evaluating the studio.

## Stack

- **Frontend** — React + TypeScript + Vite, Tailwind CSS v4, React Router
- **Backoffice** — Strapi (TypeScript) — add/edit/remove projects from an
  admin panel, no code changes needed to publish new work
- **Monorepo** — pnpm workspaces + Turborepo
- **Hosting** — Vercel (frontend) + Render/Railway (Strapi), free tiers

## Structure

```
mioraweb/
├── apps/
│   ├── web/     the public site (apps/web/README.md)
│   └── cms/     Strapi backoffice (apps/cms/README.md)
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md    architecture notes & conventions for AI-assisted work
```

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install

# copy env files and fill in values
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env

pnpm dev
```

- Site: http://localhost:5173
- Strapi admin: http://localhost:1337/admin (create your first admin user on
  first visit)

Once you have an admin account, go to **Content Manager → Project** to add
your first project (title, summary, cover image, gallery, etc.), then
publish it. It will appear on the site immediately — no rebuild needed,
since the frontend fetches from the CMS at runtime.

## Scripts (from repo root)

| Command         | Description                          |
| --------------- | ------------------------------------- |
| `pnpm dev`      | Run web + cms together                |
| `pnpm dev:web`  | Run only the frontend                 |
| `pnpm dev:cms`  | Run only Strapi                       |
| `pnpm build`    | Build both apps for production        |
| `pnpm lint`     | Lint both apps                        |
| `pnpm typecheck`| Type-check both apps                  |

## Deployment

**Frontend → Vercel**
1. Import this repo in Vercel, set **Root Directory** to `apps/web`.
2. Framework preset: Vite.
3. Add env var `VITE_STRAPI_URL` = your deployed Strapi URL.

**CMS → Render (or Railway/Fly)**
1. New Web Service, **Root Directory** = `apps/cms`.
2. Build command: `pnpm build`, start command: `pnpm start`.
3. Add a free Postgres database (e.g. via Supabase or Neon) and set
   `DATABASE_CLIENT=postgres` + `DATABASE_URL` — free web-service hosts
   have an ephemeral disk, so SQLite won't persist between restarts there.
4. Set `FRONTEND_URL` to your Vercel URL so the CMS's CORS config allows the
   site to fetch data.
5. Add a free [Cloudinary](https://cloudinary.com) account and set
   `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` — the same
   ephemeral disk that loses SQLite also loses any uploaded images
   (project covers, logo, etc.) on every redeploy, so uploads need to live
   somewhere else in production. Without these, everything still works
   locally, but uploaded media on Render will 404 after the next deploy.

See `CLAUDE.md` for the reasoning behind these choices and a few gotchas
worth knowing about before you touch the Strapi config.

## Brand

- Colors: `#FFFFFF`, `#E4E1D9`, `#000000` — kept deliberately monochrome so
  project photography carries the visual interest.
- Type: Fraunces (display) + Inter (body).
