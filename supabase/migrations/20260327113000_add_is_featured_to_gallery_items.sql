alter table if exists public.gallery_items
add column if not exists is_featured boolean not null default false;

create index if not exists gallery_items_featured_sort_idx
  on public.gallery_items (is_published, is_featured, sort_order, created_at desc);
