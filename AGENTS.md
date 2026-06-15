# AGENTS.md

## Cursor Cloud specific instructions

### What this is
ABASA (`abasa-enterprise`) is a single **Next.js 14 App Router** app (TypeScript + Tailwind) for sports-club management. There is no monorepo and no backend service in this repo — the backend is a **hosted/cloud Supabase project** (Postgres, Auth, Storage). The cloud project ref is `grvomwpejsgokxcandkr` (see the image domain allow-list in `next.config.js`).

### Running it (dev)
- Single service: `npm run dev` (Next.js dev server on port `3000`). Scripts live in `package.json` (`dev`/`build`/`start`).
- The update script already runs `npm install` on startup.

### Supabase is required and external — do NOT run it locally
- Use the existing **cloud** Supabase project only. Do not run `supabase start` / local Supabase; this repo has no `supabase/` migrations or schema, so a local instance would have none of the app's tables (`clubs`, users/roles, the `club-logos` storage bucket, etc.).
- The app reads these env vars (consumed by `lib/supabase*.ts`, `utils/supabase/client.ts`, `middleware.ts`, and most routes under `app/api`):
  - `NEXT_PUBLIC_SUPABASE_URL` (required) — `https://grvomwpejsgokxcandkr.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required) — anon key for the cloud project
  - `SUPABASE_SERVICE_ROLE_KEY` (required for registration: `app/api/auth/register`)
  - `NEXT_PUBLIC_SITE_URL` (signup/verify email redirect) — e.g. `http://localhost:3000`
  - `SMTP_PASSWORD` (optional) — only for `app/api/send-email` (Office365 SMTP)
- Provide these as Cursor **secrets** so they are injected as env vars (Next.js reads `NEXT_PUBLIC_*` from `process.env`). Alternatively create an uncommitted `.env.local` (gitignored).

### Non-obvious behavior
- Without a valid cloud anon key, public pages still render (`/`, `/auth/login`, `/auth/register`, `/dashboard`), and public landing-page images load from cloud Storage — but any auth/data call returns `{"message":"Invalid API key"}`. So a green page load does NOT prove the backend is wired; verify by actually signing in.
- `middleware.ts` runs the Supabase SSR client on `/dashboard`, `/users`, `/club`, `/settings`, and several `/auth/*` paths. The current `/dashboard` page is static (no auth gate), so login simply redirects there.
- Health/liveness without Supabase: `GET /api/health` → `{"status":"ok"}`, `GET /api/hello` → `{"ok":true}`.

### Checks available
- Typecheck: `npx tsc --noEmit`.
- Build: `npm run build`.
- There is **no lint script and no ESLint config**, and **no automated test suite** in this repo (only the VS Code ESLint extension is suggested in `.devcontainer`). Don't expect `npm run lint`/`npm test` to exist.
