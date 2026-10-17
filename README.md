# brandviserproductions

Marketing site and enquiry pipeline for **BRANDVISER**, a 360° event and brand-activation agency.
It is built from the "BRANDVISER Wireframes" design canvas (Home, Our Expertise, Gallery,
About & Process, Contact & Booking, each at desktop 1440 and mobile 390).

- **apps/web**: Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, TanStack Query, react-hook-form + zod
- **apps/api**: NestJS 12, class-validator, Prisma 7 (pg driver adapter), PostgreSQL
- **packages/contracts**: type-only API contract imported by both apps
- **Hosting**: Vercel (two projects from this monorepo) · Neon Postgres · Vercel Blob · Resend

## Architecture

```
Browser ──────────────┬─────────────────────────────────────────────────────────────┐
  │ HTML (ISR, 5 min) │ JSON, CORS: gallery "Load more", enquiries, upload token    │ PDF upload
  ▼                   ▼                                                             ▼
web  (Next.js, Vercel)            api  (NestJS, one Vercel Function, sin1)      Vercel Blob
  Server Components ──fetch──▶      /api/v1/site, services, process-steps,       (private
  tagged data cache                 case-studies, testimonials, team, faqs        store,
  /api/revalidate ◀── admin writes  /api/v1/enquiries ──waitUntil──▶ Resend email  briefs/)
                                    /api/v1/uploads/brief (token handshake)
                                    /api/v1/admin/* (Bearer token)
                                    /api/v1/health
                                         │ pg pool (pooled URL)
                                         ▼
                                    Neon Postgres (Prisma)
```

- **Reads:** pages are Server Components with ISR. They call the API at `NEXT_PUBLIC_API_URL`, and
  the responses are cached for 5 minutes under tags (`site`, `services`, `case-studies`, …). The API
  also sends `Cache-Control: s-maxage=300, stale-while-revalidate=86400`, so the CDN absorbs repeats.
- **Gallery:** a static list. The server renders the featured case study and every published case
  study (up to the API's 48-per-page limit); there are no filters or pagination.
- **Enquiries:**
  - The form validates in the browser (zod) and again in the API (class-validator DTOs).
  - The API stores the row, issues a reference (`BV-2026-0042`) and returns it straight away.
  - The notification email, with the PDF brief attached, is sent after the response via `waitUntil`, so a mail outage never fails a submission.
  - A honeypot field and per-IP throttling filter spam.
- **Uploads:** the browser uploads the PDF straight to a private Vercel Blob store using a short-lived
  token from `POST /api/v1/uploads/brief` (PDF only, 10 MB maximum). The file never passes through a
  function, so the 4.5 MB request body limit doesn't apply.
- **Content edits:** the `/api/v1/admin/*` routes write to the database and then call the web app's
  `POST /api/revalidate` with the affected tags, so changes appear immediately.

## Layout

```
apps/
  api/
    prisma/schema.prisma · migrations/ · seed.ts
    scripts/migrate-on-deploy.mjs   Vercel build: migrate production (and previews only if opted in)
    src/main.ts                     entrypoint for local + Vercel (keep NestFactory + app.listen here)
    src/bootstrap.ts                prefix /api, URI versioning (v1), validation pipe, helmet, CORS
    src/config/                     env validation, CORS origin parsing, security headers
    src/common/                     cache-control decorator/interceptor, admin guard, Prisma error filter,
                                    pagination, labels, field-level validation errors
    src/modules/                    site · services · process · case-studies · testimonials · team · faqs
                                    enquiries · uploads · notifications · revalidation · admin · health
  web/
    src/app/                        / · /expertise · /gallery · /gallery/[slug] · /contact
                                    /privacy · /terms · /api/revalidate · sitemap · robots · error · not-found
    src/components/
      ui/                           shadcn/ui (restyled to the BRANDVISER tokens)
      layout/                       SiteHeader, MainNav, MobileMenu, SiteFooter, MobileContactBar
      common/                       Section, SectionHeading, EventImage, StatsRow, ClientLogos, ProcessSteps,
                                    Testimonials, FaqList, CtaBand, FormField, OptionSelect, PageSkeleton
      home/ expertise/ gallery/ contact/
    src/lib/api/                    server.ts (tagged server fetch) · client.ts · hooks.ts · use-brief-upload.ts
    src/lib/validation/enquiry.ts   zod schemas that mirror the API DTOs
packages/contracts/index.d.ts
```

## API

All routes are under `/api/v1`. Public GETs are CDN-cacheable; everything else is `no-store`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/site` | Contact details, headline stats (null = not confirmed, hidden), client logos |
| GET | `/services` · `/services/matrix` | Four practices with deliverables; event-type × service matrix |
| GET | `/process-steps` | Insight → Imagination → Orchestration → Impact |
| GET | `/case-studies?type&service&city&year&featured&page&limit` | `{items,total,page,pageCount,limit}` |
| GET | `/case-studies/facets` · `/case-studies/slugs` · `/case-studies/:slug` | Filter options and counts; sitemap; detail page |
| GET | `/testimonials?featured&limit` · `/team` · `/faqs?page=expertise\|contact` | |
| POST | `/enquiries` · `/enquiries/quick` | 201 `{reference, schedulerUrl}`. 400 includes `fields: {name: "…"}`. 5 per minute per IP |
| POST | `/uploads/brief` | Vercel Blob client-upload token handshake |
| * | `/admin/...` | `Authorization: Bearer $ADMIN_API_TOKEN`. CRUD for case studies, testimonials, services, process steps, team, client logos, FAQs; `PATCH /admin/site`; `GET/PATCH /admin/enquiries`, `GET /admin/enquiries/:id/attachment` |
| GET | `/health` | Database, migrations and content counts; 503 when the database is down |

Example: publishing the real stats.

```bash
curl -X PATCH "$API/api/v1/admin/site" -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"citiesCovered":400,"clientBrands":75,"eventsDelivered":1000,"countriesCovered":15}'
```

## Local development

Requirements: Node 24 and Docker.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm install
npm run db:up        # Postgres 17 on localhost:5434
npm run db:migrate   # prisma migrate dev
npm run db:seed      # wireframe copy + clearly marked placeholders
npm run dev          # api on :4000, web on :3000
```

Checks: `npm run typecheck` · `npm test` (API unit tests) · `npm run lint` · `npm run build`.
The web build prerenders pages, so the API must be running for `npm run build -w @brandviserproductions/web`.

Without `RESEND_API_KEY`, enquiry emails are written to the API log instead of being sent. Without
`BLOB_READ_WRITE_TOKEN`, PDF upload returns 503 and the rest of the form still works.

## Deploying to Vercel

There are two projects from one repository, so the site and the API release and roll back independently.

| Project | Root directory | Framework preset | Region |
| --- | --- | --- | --- |
| `brandviserproductions-api` | `apps/api` | NestJS (detected from `src/main.ts`) | `sin1` |
| `brandviserproductions-web` | `apps/web` | Next.js | `sin1` |

Each app's `vercel.json` only pins the region (next to Neon's Singapore region) and adds an
`ignoreCommand`, which skips a build when nothing in that app or `packages/contracts` changed. NestJS
needs **no** `builds`, `routes` or serverless wrapper: Vercel runs `src/main.ts` as a single Function on
Fluid compute and serves every `/api/v1/*` route from it. The API project's `vercel-build` script runs
`prisma generate`, then `prisma migrate deploy` (production only, see `scripts/migrate-on-deploy.mjs`),
then `nest build`.

### Step by step (Vercel CLI)

```bash
# 0. One-time
npm i -g vercel@latest
vercel login
git init && git add -A && git commit -m "Initial commit"
gh repo create brandviserproductions --private --source . --push   # or push to an existing remote

# 1. API project
cd apps/api
vercel link --project brandviserproductions-api          # create it; set Root Directory = apps/api in the dashboard if prompted
vercel integration add neon                              # injects DATABASE_URL + DATABASE_URL_UNPOOLED
vercel blob create-store brandviserproductions-briefs --access private --region sin1
                                                         # connect it to this project (prompted). The brief upload
                                                         # handshake needs BLOB_READ_WRITE_TOKEN: if the project was
                                                         # connected with OIDC only, copy the store's read-write
                                                         # token from its dashboard and `vercel env add` it.
vercel integration add resend                            # injects RESEND_API_KEY (verify your sending domain in Resend)
vercel env add ENQUIRY_NOTIFY_TO production              # e.g. events@yourdomain.com
vercel env add ENQUIRY_FROM production                   # e.g. BRANDVISER Website <enquiries@yourdomain.com>
vercel env add ADMIN_API_TOKEN production                # openssl rand -hex 32
vercel env add REVALIDATE_SECRET production              # openssl rand -hex 32 (same value on the web project)
vercel env add SCHEDULER_URL production                  # Cal.com / Calendly link (optional)
vercel deploy --prod                                     # migrates the database, prints the API URL
DATABASE_URL_UNPOOLED="<from vercel env pull>" npx prisma db seed   # once, for the initial content

# 2. Web project
cd ../web
vercel link --project brandviserproductions-web
vercel env add NEXT_PUBLIC_API_URL production            # https://brandviserproductions-api.vercel.app
vercel env add NEXT_PUBLIC_SITE_URL production           # https://your-domain
vercel env add NEXT_PUBLIC_SCHEDULER_URL production      # optional
vercel env add REVALIDATE_SECRET production
vercel deploy --prod

# 3. Connect the two
cd ../api
vercel env add CORS_ORIGINS production                   # https://your-domain,https://brandviserproductions-web-*.vercel.app
vercel env add WEB_REVALIDATE_URL production             # https://your-domain/api/revalidate
vercel deploy --prod
```

Add the same variables for the **Preview** environment if you use preview deployments. Point
the web project's preview `NEXT_PUBLIC_API_URL` at the API's preview or branch domain. Previews
only run migrations when `MIGRATE_PREVIEWS=1`, which you should set only if each preview has its
own Neon database branch.

**Recommended:** add a Vercel Firewall rate-limit rule on `/api/v1/enquiries*` and
`/api/v1/uploads/*`. The in-app throttle is per function instance.

### Environment variables

| Variable | Project | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | api | Pooled Postgres URL for the runtime (Neon integration) |
| `DATABASE_URL_UNPOOLED` | api | Direct URL for Prisma Migrate and the seed |
| `CORS_ORIGINS` | api | Browser origins allowed to call the API; one `*` per entry for preview hostnames |
| `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO`, `ENQUIRY_FROM` | api | Enquiry notification email (comma-separate several recipients) |
| `BLOB_READ_WRITE_TOKEN` | api | Private Blob store for PDF briefs |
| `ADMIN_API_TOKEN` | api | Bearer token for `/api/v1/admin/*`. Unset means every admin request gets a 401 |
| `WEB_REVALIDATE_URL`, `REVALIDATE_SECRET` | api | On-demand ISR after admin writes |
| `SCHEDULER_URL` | api | Booking link returned after an enquiry |
| `MIGRATE_PREVIEWS` | api | `1` to migrate on preview builds (only with per-preview database branches) |
| `NEXT_PUBLIC_API_URL` | web | API origin, no trailing slash |
| `NEXT_PUBLIC_SITE_URL` | web | Canonical URL (metadata, sitemap) |
| `NEXT_PUBLIC_SCHEDULER_URL` | web | Booking page for "Choose a time"; empty means a link to the form |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | web | Optional desktop hero reel |
| `REVALIDATE_SECRET` | web | Must match the API's value |

## Before launch

These are placeholders in the seed and code, shown in brackets on the site:

- Contact details, company description, opening hours, map link and image: `PATCH /admin/site`
- Headline stats (hidden until set): `PATCH /admin/site`
- Case studies, testimonials, team, client logos: admin API. Then remove the `picsum.photos` entries
  from `apps/web/next.config.ts`.
- FAQ answers: `PATCH /admin/faqs/:id`
- Process step durations ("Typical time" is hidden while empty): `PATCH /admin/process-steps/:id`
- Audience-size and budget bands (`AudienceSize`, `BudgetRange` in `schema.prisma`, labels in both apps)
- The event-type × service matrix is indicative: adjust it with `eventTypes` on `PATCH /admin/services/:id`
- Privacy policy and terms pages (`apps/web/src/app/privacy`, `apps/web/src/app/terms`)
