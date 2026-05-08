# Pending manual steps

## Pending migrations — run in Supabase SQL Editor

### 02_transfer.sql

Adds transfer delivery columns to the bookings table.
Run this in the Supabase SQL Editor (Dashboard → SQL Editor) for your project.

```sql
ALTER TABLE bookings
  ADD COLUMN transfer_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN transfer_address text,
  ADD COLUMN transfer_fee_eur numeric;
```

`transfer_fee_eur` is set by the admin after inquiry — customers never write to it directly.
