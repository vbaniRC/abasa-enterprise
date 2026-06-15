# Supabase schema sync review

## Result

No schema-changing migration was generated.

The repository checkout and `origin/main` do not contain `schema.sql`, SQL
migrations, or a Supabase CLI config. Because the requested repo schema baseline
is missing, there is no safe source of truth to diff against the live Supabase
cloud schema.

## Prepared migration

`supabase/migrations/20260615120600_sync_cloud_schema_with_repo.sql` is a
non-destructive review placeholder. It intentionally contains comments only and
does not apply any DDL.

## Live Supabase schema metadata

Source: `NEXT_PUBLIC_SUPABASE_URL/rest/v1/` with
`Accept: application/openapi+json`, authenticated by the service-role key.

The live public REST schema currently exposes:

| Table/function | Notes |
| --- | --- |
| `attendance` | Table |
| `club` | Table |
| `coaches` | Table |
| `coaches_locations` | Table |
| `competitions` | Table |
| `email_verification_codes` | Table |
| `groups` | Table |
| `groups_locations` | Table |
| `locations` | Table |
| `members` | Table |
| `members_groups` | Table |
| `members_parents` | Table |
| `notifications` | Table |
| `parents` | Table |
| `payments` | Table |
| `profiles` | Table |
| `programs` | Table |
| `schedule` | Table |
| `schedule_acceptance` | Table |
| `create_club` | RPC function |

## Comparison inputs checked

- `git ls-files` contains no `schema.sql` and no `*.sql` files.
- `git log --all -- '*schema*.sql' '*.sql'` returned no historical SQL files.
- `git ls-tree -r --name-only origin/main` contains only Supabase client code,
  not schema or migration files.
- `supabase projects list` failed because the environment does not provide a
  Supabase access token, so the CLI cannot produce a full database dump.

## Reviewer follow-up needed

Add the intended `schema.sql` baseline to the repo, or provide a branch/path that
contains it. After that, generate the migration by diffing that file against a
full live schema dump and keep only non-destructive operations such as
`CREATE TABLE`, `CREATE INDEX`, `ALTER TABLE ... ADD COLUMN`, and
`ALTER TABLE ... ADD CONSTRAINT`.
