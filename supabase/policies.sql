-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table cars     enable row level security;
alter table bookings enable row level security;
alter table customers enable row level security;
alter table admin_users enable row level security;

-- ============================================================
-- CARS — public read (non-hidden), admin full access via service role
-- ============================================================
create policy "Public can view available cars"
  on cars for select
  using (status != 'hidden');

-- Service role bypasses RLS — no explicit admin policy needed

-- ============================================================
-- BOOKINGS — service role only (all server routes use service role)
-- ============================================================
-- No public access policy. All booking reads/writes go through
-- API routes that use supabaseAdmin (service role key).

-- ============================================================
-- CUSTOMERS — service role only
-- ============================================================
-- Same as bookings.

-- ============================================================
-- ADMIN USERS — only the authenticated user can see their own record
-- ============================================================
create policy "Admin can view own record"
  on admin_users for select
  using (auth.uid() = id);

-- ============================================================
-- STORAGE
-- ============================================================
-- Run these in Supabase dashboard or via API after creating buckets:

-- Bucket: car-photos (public)
-- insert into storage.buckets (id, name, public) values ('car-photos', 'car-photos', true);
-- create policy "Public read car photos" on storage.objects for select using (bucket_id = 'car-photos');
-- create policy "Service role write car photos" on storage.objects for insert with check (bucket_id = 'car-photos');

-- Bucket: documents (private, signed URLs only)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
-- Service role only — no public policies.
