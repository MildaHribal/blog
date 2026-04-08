# ByteFeed (Next.js + Prisma + Neon)

Dark-themed blog with:
- public blog pages (`/`, `/blog`, `/blog/[slug]`)
- DB-first content via Prisma + Neon Postgres
- fallback to local MDX files when DB is not configured
- protected admin panel at `/admin`
- admin auth endpoints and CRUD API for posts

## Tech stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Prisma ORM
- Neon Postgres
- JWT session cookie (custom auth)

## Project routes

- Public:
  - `/`
  - `/blog`
  - `/blog/[slug]`
- Admin:
  - `/admin`
  - `/admin/new`
  - `/admin/[id]`
- API:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET /api/admin/posts`
  - `POST /api/admin/posts`
  - `PATCH /api/admin/posts/[id]`
  - `DELETE /api/admin/posts/[id]`

## Environment setup

1) Copy env template:

```bash
cp .env.example .env
```

2) Fill `.env` values:
- `DATABASE_URL` = Neon pooled URL
- `DIRECT_URL` = Neon direct URL (or same as `DATABASE_URL` temporarily)
- `NEXT_PUBLIC_BASE_URL` = your app URL (e.g. `http://localhost:3000`)
- `ADMIN_USERNAME` = admin login username
- `ADMIN_PASSWORD` = admin login password
- `ADMIN_SESSION_SECRET` = long random secret

3) Restart dev server after `.env` changes (if already running).

## Install + run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init_posts
npm run dev
```

Open:
- `http://localhost:3000`
- `http://localhost:3000/admin`

## How to test on localhost

1) Visit `http://localhost:3000/admin` and sign in.
2) Open `New post`, create a test post with status `PUBLISHED`.
3) Verify it appears on:
   - `http://localhost:3000/`
   - `http://localhost:3000/blog`
   - `http://localhost:3000/blog/<your-slug>`
4) Edit and delete the post from admin and verify changes are reflected.

## Build test

```bash
npm run build
npm run lint
```

## Docker build (production image)

```bash
docker build -t blog:local .
docker run --rm -p 3000:3000 --env-file .env blog:local
```

## Docker Compose (app + local Postgres)

```bash
docker compose -f docker/docker-compose.yml up -d --build
docker compose -f docker/docker-compose.yml logs -f app
```

After the first start, run migrations against the configured DB:

```bash
npm run prisma:deploy
```

## GitHub Actions CI/CD

Workflow file: `.github/workflows/build.yml`

- Builds and pushes image to GHCR on push to `main`/`master`
- Tags images as `latest` (default branch) and commit `sha`
- Uses GitHub Actions cache for Docker layers
- Optional deploy webhook is triggered when `DEPLOY_WEBHOOK_URL` secret is set

Required repository settings:
- Packages permission enabled for GHCR
- Secret `DEPLOY_WEBHOOK_URL` (optional)

## Notes

- If `DATABASE_URL` is missing, public pages use local `content/posts/*.mdx` fallback.
- Admin/API routes require DB to be configured.
- `robots.txt` disallows `/admin` and `/api/`.
