# Supabase OAuth Setup (GitHub + Google)

The blog's comment layer uses **Supabase Auth** with two social login providers,
**GitHub** and **Google (GCP)**, plus a `comments` table protected by Row Level
Security. The frontend is already wired (`lib/supabase.ts`, `hooks/useAuth.tsx`,
`hooks/useComments.ts`, `components/organisms/CommentsSection.tsx`). This guide
covers the parts that must be created and configured **outside the repo**, and
the secrets you must add to make it work end to end.

At a glance, you need to:

1. Create a Supabase project and apply the `comments` migration.
2. Create a **GitHub OAuth App** and wire it into Supabase.
3. Create a **Google OAuth client** (GCP) and wire it into Supabase.
4. Allowlist your site URLs in Supabase Auth.
5. Add the two build secrets to the repo (and to Cloudflare Pages).

---

## 1. Create the Supabase project & database

1. Go to <https://supabase.com/dashboard>, **New project**. Pick a region close
   to your readers and set a strong database password.
2. Note the **Project ref** (the `abcd...` in the project URL). You'll reuse it.
3. Apply the comments schema (`supabase/migrations/0001_comments.sql`), any one of:
   - **Dashboard:** SQL Editor → paste the migration → Run.
   - **CLI:** `supabase link --project-ref <ref>` then `supabase db push`.
4. Grab your client credentials from **Project Settings → API**:
   - **Project URL** → becomes `VITE_SUPABASE_URL`
     (`https://<project-ref>.supabase.co`)
   - **anon / publishable key** → becomes `VITE_SUPABASE_ANON_KEY`
     (safe to expose in the browser — RLS guards all writes)

> The **Supabase callback URL** used by both providers below is:
> `https://<project-ref>.supabase.co/auth/v1/callback`

---

## 2. GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   (<https://github.com/settings/developers>).
2. Fill in:
   - **Application name:** e.g. `feliperocha.systems comments`
   - **Homepage URL:** your site, e.g. `https://feliperocha.systems`
   - **Authorization callback URL:**
     `https://<project-ref>.supabase.co/auth/v1/callback`
3. **Register application**, then **Generate a new client secret**.
4. Copy the **Client ID** and **Client secret**.
5. In Supabase → **Authentication → Providers → GitHub**: enable it, paste the
   Client ID and Client secret, **Save**.

---

## 3. Google OAuth client (GCP)

1. In the [Google Cloud Console](https://console.cloud.google.com/), create (or
   pick) a project.
2. **APIs & Services → OAuth consent screen**: configure it (External),
   add your app name, support email, and (once ready) publish it. Add yourself
   as a test user while it's in testing.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Application type:** Web application
   - **Authorized JavaScript origins:** your site origin(s), e.g.
     `https://feliperocha.systems` (and `http://localhost:5173` for local dev)
   - **Authorized redirect URI:**
     `https://<project-ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client secret**.
5. In Supabase → **Authentication → Providers → Google**: enable it, paste the
   Client ID and Client secret, **Save**.

---

## 4. Allowlist your site URLs in Supabase

`useAuth` signs in with `redirectTo: window.location.href`, so Supabase must
trust the URLs it may redirect back to.

Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://feliperocha.systems` (your production origin)
- **Redirect URLs** (add each that applies):
  - `https://feliperocha.systems/**`
  - `http://localhost:5173/**` (local dev)
  - your Cloudflare Pages preview domain if you use previews, e.g.
    `https://*.feliperocha-systems.pages.dev/**`

---

## 5. Secrets & environment variables to add

Only two client variables are needed (the anon key is public by design; the
GitHub/Google **client secrets never leave Supabase** — they are stored in the
Supabase dashboard, not in this repo).

| Name | Value | Where to add |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` | GitHub repo secret **and** Cloudflare Pages env var |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key | GitHub repo secret **and** Cloudflare Pages env var |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key (existing contact form) | GitHub repo secret **and** Cloudflare Pages env var |

### GitHub repository secrets (used by the CI production build)

Repo → **Settings → Secrets and variables → Actions → New repository secret**,
add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_TURNSTILE_SITE_KEY`.
The `build` job in `.github/workflows/ci.yml` reads them.

### Cloudflare Pages environment variables (used by the real deploy)

Cloudflare Pages is what serves the site. The Vite build inlines `VITE_*` at
build time, so they must exist in the **build** environment:

Cloudflare Dashboard → your Pages project → **Settings → Environment variables**
→ add the same three variables for **Production** (and **Preview** if used) →
redeploy.

> These are **not runtime** secrets — Vite bakes them into the static bundle at
> build time. The Supabase anon key is meant to be public; real protection comes
> from the RLS policies in the migration.

---

## 6. Verify

1. Set the two `VITE_SUPABASE_*` vars locally (e.g. in `.env`) and run
   `npm run dev`.
2. Open any blog post; the **Comments** section should render a sign-in prompt.
3. "Continue with GitHub" / "Continue with Google" → complete the OAuth flow →
   you should return to the post, signed in.
4. Post a comment; reload — it persists. Delete it (soft delete) — it disappears.
5. If the section doesn't render at all, `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` aren't reaching the build (the UI hides itself when
   Supabase isn't configured).

## Checklist

- [ ] Supabase project created
- [ ] `0001_comments.sql` migration applied (table + RLS + trigger)
- [ ] GitHub OAuth App created; Client ID/secret saved in Supabase
- [ ] Google OAuth client created; Client ID/secret saved in Supabase
- [ ] Site URL + Redirect URLs allowlisted in Supabase
- [ ] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` added as GitHub repo secrets
- [ ] Same vars added to Cloudflare Pages env and redeployed
