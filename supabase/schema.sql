create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  title text,
  alt_text text not null default 'Gallery image',
  category text,
  sort_order integer not null default 1000,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  image_url text not null,
  storage_path text
);

create index if not exists gallery_items_published_sort_idx
  on public.gallery_items (is_published, sort_order, created_at desc);

create index if not exists gallery_items_featured_sort_idx
  on public.gallery_items (is_published, is_featured, sort_order, created_at desc);

create or replace function public.set_gallery_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;

create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row
execute procedure public.set_gallery_items_updated_at();

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
on public.gallery_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated can manage gallery items" on public.gallery_items;
create policy "Authenticated can manage gallery items"
on public.gallery_items
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can read gallery files" on storage.objects;
create policy "Public can read gallery files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

drop policy if exists "Authenticated can upload gallery files" on storage.objects;
create policy "Authenticated can upload gallery files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can update gallery files" on storage.objects;
create policy "Authenticated can update gallery files"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can delete gallery files" on storage.objects;
create policy "Authenticated can delete gallery files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery');
