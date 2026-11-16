-- Blog comments schema for the Supabase-backed comment layer.
--
-- The frontend (src/client/src/hooks/useComments.ts) expects a `comments`
-- table with the columns below, public read access to non-deleted rows, and
-- Row Level Security so that:
--   * anyone can READ non-deleted comments (even logged out),
--   * only authenticated users can INSERT, and only as themselves,
--   * users can only UPDATE their own rows (used for soft-delete).
--
-- Apply with either:
--   supabase db push                       (Supabase CLI, linked project)
--   psql "$SUPABASE_DB_URL" -f 0001_comments.sql
-- or paste into the SQL Editor in the Supabase dashboard.

create extension if not exists "pgcrypto";

create table if not exists public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_slug     text not null check (char_length(post_slug) between 1 and 200 and post_slug ~ '^[a-z0-9-]+$'),
  user_id       uuid not null references auth.users (id) on delete cascade,
  author_name   text not null check (char_length(trim(author_name)) between 1 and 120),
  author_avatar text check (author_avatar is null or (char_length(author_avatar) <= 500 and author_avatar ~ '^https://')),
  content       text not null check (char_length(content) between 1 and 5000),
  parent_id     uuid references public.comments (id) on delete set null,
  is_deleted    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Read path: fetch a post's thread ordered by time.
create index if not exists comments_post_slug_created_at_idx
  on public.comments (post_slug, created_at);

-- Reply lookups.
create index if not exists comments_parent_id_idx
  on public.comments (parent_id);

-- Keep updated_at fresh on every write (e.g. the soft-delete update) and
-- prevent updates to immutable columns.
create or replace function public.prevent_comment_immutable_columns_update()
returns trigger
language plpgsql
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'Modifying comment id is not allowed';
  end if;
  if new.user_id is distinct from old.user_id then
    raise exception 'Modifying comment user_id is not allowed';
  end if;
  if new.post_slug is distinct from old.post_slug then
    raise exception 'Modifying comment post_slug is not allowed';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'Modifying comment created_at is not allowed';
  end if;
  if new.author_name is distinct from old.author_name then
    raise exception 'Modifying comment author_name is not allowed';
  end if;
  if new.author_avatar is distinct from old.author_avatar then
    raise exception 'Modifying comment author_avatar is not allowed';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists comments_prevent_immutable_update on public.comments;
create trigger comments_prevent_immutable_update
  before update on public.comments
  for each row
  execute function public.prevent_comment_immutable_columns_update();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
  before update on public.comments
  for each row
  execute function public.set_updated_at();

-- Row Level Security ----------------------------------------------------------

alter table public.comments enable row level security;

-- Anyone (including anonymous readers) can see comments that aren't deleted.
drop policy if exists "comments_select_public" on public.comments;
create policy "comments_select_public"
  on public.comments
  for select
  using (is_deleted = false);

-- Signed-in users may add comments, but only attributed to themselves.
drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own"
  on public.comments
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Users may modify only their own comments (soft-delete / edit).
drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
  on public.comments
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
