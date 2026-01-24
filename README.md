# JOOUST STORE

Modern ecommerce web application built with:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- SQLite + Prisma ORM

## Project Structure

Key folders:

- `src/app/`
  - `page.tsx`: customer-facing landing page (UI shell)
  - `admin/page.tsx`: admin dashboard placeholder
- `src/components/`
  - `site/`: shared layout components (header/navigation)
  - `shop/`: storefront UI components (product cards, etc.)
- `src/lib/`
  - `prisma.ts`: PrismaClient singleton
- `prisma/`
  - `schema.prisma`: database models
  - `seed.ts`: sample seed data (admin, customer, categories, products)

## Environment Variables

This repo includes `.env.example`.

1) Copy it to `.env`:

```bash
cp .env.example .env
```

2) Update `DATABASE_URL` for SQLite.

Example:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace_me_with_a_long_random_string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Setup (Prisma + SQLite)

SQLite is used for local development. No external database needed.

Then:

```bash
npm install
npm run prisma:migrate
npm run db:seed
```

## Production Database Migrations

For production, consider using PostgreSQL. Update DATABASE_URL accordingly and run:

```bash
npm run prisma:migrate:deploy
```

## Run Locally

```bash
npm run dev
```

Open:

- `http://localhost:3000` (shop)
- `http://localhost:3000/admin` (admin dashboard)

## Seeded Accounts

These users are created by `npm run db:seed`:

- Admin
  - Email: `admin@gas-shop.local`
  - Password: `Admin123!`
- Admin
  - Email: `tesheric9@gmail.com`
  - Password: `121212`
- Customer
  - Email: `customer@gas-shop.local`
  - Password: `Customer123!`

## Notes

- Admin routes are protected by middleware (`/admin` and `/api/admin`).
- Image hosting defaults to local storage (`public/uploads`). For production, use an external provider (Cloudinary recommended).

## Deployment (Vercel)

1) Push this repo to GitHub.

2) Create a database (SQLite for simple deployments, or PostgreSQL from Neon, Supabase, etc.).

3) Create a new Vercel project and set environment variables:

- `DATABASE_URL` (SQLite: "file:./dev.db" or hosted DB URL)
- `JWT_SECRET` (long random string)
- `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g. `https://your-app.vercel.app`)

4) Deploy.

5) Run migrations on the database:

- For SQLite: run locally or in CI
- For hosted DB: run `prisma migrate deploy` against the DB

6) (Optional) Seed initial data:

```bash
npm run db:seed
```
