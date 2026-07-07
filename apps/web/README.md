# apps/web — MIORA WEB site

React + TypeScript + Vite frontend. Fetches published projects from the
Strapi CMS in `../cms` and renders a home grid + per-project detail pages.

See the root [README.md](../../README.md) and [CLAUDE.md](../../CLAUDE.md)
for the full picture (monorepo commands, deployment, brand).

## Local dev

```bash
cp .env.example .env   # set VITE_STRAPI_URL if not using localhost:1337
pnpm dev
```

## Structure

```
src/
├── components/   Header, Footer, ProjectCard, ProjectGrid
├── pages/        Home, ProjectDetail
├── lib/strapi.ts Strapi REST client (fetch helpers, media URL resolver)
└── types/        Project + Strapi response types
```
