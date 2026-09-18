# JOOUST STORE

Modern ecommerce web application built with Next.js App Router, TypeScript, Tailwind CSS, Prisma and SQLite-compatible Cloudflare D1.

## Cloudflare deployment

This repository is configured for **Cloudflare Workers** using **vinext**. Cloudflare currently recommends vinext for full-stack Next.js applications on Workers. The application uses **Cloudflare D1** for production data storage through Prisma's D1 adapter.

### 1. Create the D1 database

From the repository root:

```bash
npx wrangler login
npx wrangler d1 create gase-db
```

Copy the returned `database_id` into `wrangler.jsonc`:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "gase-db",
    "database_id": "YOUR_REAL_D1_DATABASE_ID",
    "migrations_dir": "migrations"
  }
]
```

### 2. Install and generate types

```bash
npm install
npm run cf:typegen
npm run prisma:generate
```

If the Wrangler-generated `worker-configuration.d.ts` replaces the checked-in type file, commit the regenerated file.

### 3. Configure the production secret

Do **not** put `JWT_SECRET` in `wrangler.jsonc` or Git.

```npx wrangler secret put JWT_SECRET```

Set the production URL as a Worker variable or through the Cloudflare dashboard:

```bash
npx wrangler secret put JWT_SECRET
```

For non-secret public configuration, use `vars` in Wrangler or Cloudflare's Worker settings.

### 4. Apply the D1 schema

The initial schema is in:

```
migrations/0001_init/migration.sql
```

Apply it to production:

```bash
npx wrangler d1 migrations apply gase-db --remote
```

### 5. Test the Cloudflare build

```bash
npm run build:vinext
```

Run the Cloudflare runtime locally with:

```bash
npx wrangler dev
```

### 6. Deploy

```bash
npm run deploy
```

The deployment uses Cloudflare Workers rather than the old Cloudflare Pages static-export path. This is important because the store uses server-side rendering, middleware, route handlers and database access.

### Cloudflare dashboard / Git deployments

You can connect this GitHub repository to **Workers Builds**. Use:

- **Build command:** `npm run build:vinext`
- **Deploy command:** `npx wrangler deploy`
- **Production branch:** `main`

Configure the D1 binding named `DB` and the `JWT_SECRET` secret in the Worker environment.

## Local development

For the traditional Node/Next.js development environment:

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run db:seed
npm run dev
```

For Cloudflare-compatible development:

```npm run dev:vinext```

The Cloudflare-compatible path expects the D1 binding to be configured in `wrangler.jsonc`.

## Important production notes

- SQLite files are not suitable as the persistent production database on Workers; use D1.
- The D1 database ID in `wrangler.jsonc` must be replaced with the real ID from your Cloudflare account.
- `JWT_SECRET` must be stored as a Cloudflare Worker secret.
- The existing `prisma/seed.ts` is a Node/SQLite seed script. Do not run it directly against production D1. Create/apply a D1-compatible seed migration or seed through an authenticated administrative workflow.
- Product image uploads currently depend on the application's existing storage implementation. For production-scale uploads, Cloudflare R2 is the appropriate next step.

## Project structure

- `src/app/` — storefront, checkout, account and admin pages
- `src/components/` — UI components
- `src/lib/` — authentication, Prisma and helpers
- `prisma/schema.prisma` — database model
- `migrations/` — Cloudflare D1 migrations
- `vite.config.ts` — vinext + Cloudflare Vite configuration
- `wrangler.jsonc` — Cloudflare Worker and D1 configuration
