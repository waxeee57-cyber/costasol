-- Enable btree_gist extension for exclusion constraints
create extension if not exists btree_gist;

-- ============================================================
-- CARS
-- ============================================================
create table if not exists cars (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  brand            text not null,
  model            text not null,
  year             int,
  category         text check (category in ('sport','suv','sedan','convertible','luxury')),
  license_plate    text unique,
  transmission     text,
  fuel             text,
  seats            int,
  daily_price_eur  numeric not null,
  deposit_eur      numeric not null,
  mileage_included_per_day int default 200,
  extra_km_price_eur numeric default 0.50,
  min_driver_age   int default 25,
  min_license_years int default 2,
  status           text check (status in ('available','maintenance','hidden')) default 'available',
  photos           jsonb default '[]',
  features         jsonb default '[]',
  description      text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  phone      text,
  full_name  text not null,
  country    text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  booking_code     text unique not null,
  car_id           uuid not null references cars(id),
  customer_id      uuid not null references customers(id),
  pickup_location  text not null,
  dropoff_location text not null,
  start_at         timestamptz not null,
  end_at           timestamptz not null,
  days             int not null,
  total_eur        numeric not null,
  deposit_eur      numeric not null,
  customer_message text,
  status           text not null check (status in (
                     'inquiry','confirmed','picked_up','returned','completed','cancelled'
                   )) default 'inquiry',
  status_history   jsonb default '[]',
  license_doc_url  text,
  id_doc_url       text,
  return_notes     text,
  admin_notes      text,
  source           text default 'web' check (source in ('web','manual')),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Exclusion constraint: only confirmed/picked_up/returned bookings reserve dates
alter table bookings add constraint no_overlap
  exclude using gist (
    car_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  ) where (status in ('confirmed','picked_up','returned'));

-- ============================================================
-- ADMIN USERS
-- ============================================================
create table if not exists admin_users (
  id         uuid primary key references auth.users on delete cascade,
  role       text default 'admin',
  full_name  text,
  created_at timestamptz default now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cars_updated_at
  before update on cars
  for each row execute function set_updated_at();

create trigger customers_updated_at
  before update on customers
  for each row execute function set_updated_at();

create trigger bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ============================================================
-- CUSTOMER UPSERT FUNCTION
-- ============================================================
create or replace function upsert_customer(
  p_email     text,
  p_phone     text,
  p_full_name text,
  p_country   text
) returns uuid language plpgsql as $$
declare
  v_id uuid;
begin
  insert into customers (email, phone, full_name, country)
  values (p_email, p_phone, p_full_name, p_country)
  on conflict (email) do update
    set phone      = excluded.phone,
        full_name  = excluded.full_name,
        country    = excluded.country,
        updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;
