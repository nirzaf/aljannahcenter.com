# Al-Jannah Centre

Website for [Al-Jannah Centre](https://aljannahcenter.com), a centre for children with special needs and skills in Kochchikade, Negombo, Sri Lanka.

Built with [Astro](https://astro.build) and the [EmDash](https://emdashcms.com) CMS, running on Cloudflare Workers with D1 (database) and R2 (media storage).

## Requirements

- Node.js `>=22.13.0`
- pnpm `11.25.0` (`corepack enable` picks up the version from `package.json`)

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Astro dev server with hot reload at http://localhost:4321 |
| `pnpm build` | Production build into `dist/` |
| `pnpm start` | Run the built Worker locally through Wrangler at http://localhost:8787 |
| `pnpm lint` | Type-check with `astro check` |
| `pnpm emdash:validate-seed` | Validate `seed/seed.json` |

## Project layout

- `src/pages/` — routes (home, updates, articles, CMS pages, search, RSS)
- `src/layouts/Base.astro` — shared header, mobile menu, footer and quick-action bar
- `src/components/` — page components, including the React photo gallery
- `src/data/` — Centre contact details, bank accounts and gallery photo lists
- `src/styles/site.css` — all site styles (mobile first)
- `src/worker.ts` — Cloudflare Worker entry that wraps EmDash and adds security headers
- `seed/seed.json` — initial EmDash content, menus and settings
- `public/gallery/`, `public/instagram/` — gallery photos, with 480px webp versions in `thumbs/`

## Publishing content

Articles, updates and pages are edited in the EmDash admin at `/_emdash/admin`.

The redesign adds an **Impact milestones** collection with `value`, `label`, and
`position` fields. Published milestones appear in display order on the homepage.
Apply the updated `seed/seed.json` to the site's CMS database to create this
collection. The deployment workflow validates the seed but does not apply it to
production. Until the collection is available, the homepage uses the three
existing milestones as a fallback. Keep published achievements source-verified.

## Design system

The official indigo palette (`#20266E` / `#2B3176`) lives in `site.css`, alongside
neutral, gold, spacing, and radius tokens. Original logo colours are preserved.
Homepage sections live in `src/components/home/`; `/gallery` retains the React
lightbox with `client:visible` hydration. The static hero prioritizes one authentic
photograph, while updates, articles and CMS pages share the same visual language.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which installs, validates the seed, type-checks, builds and deploys with Wrangler. The deploy step needs a `CLOUDFLARE_API_TOKEN` repository secret for the Cloudflare account that hosts the site.
