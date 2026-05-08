ALTER TABLE bookings
  ADD COLUMN transfer_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN transfer_address text,
  ADD COLUMN transfer_fee_eur numeric;
  -- transfer_fee_eur is set by admin after inquiry, not by customer
