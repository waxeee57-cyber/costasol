-- ============================================================
-- SEED DATA — development only
-- Replace with real data before launch (see PLACEHOLDERS.md)
-- ============================================================

insert into cars (
  slug, brand, model, year, category,
  daily_price_eur, deposit_eur,
  mileage_included_per_day, extra_km_price_eur,
  min_driver_age, min_license_years,
  transmission, fuel, seats,
  status, description, photos, features
) values (
  'lamborghini-huracan-2024',
  'Lamborghini', 'Huracán', 2024, 'sport',
  1200, 15000,
  200, 1.50,
  25, 3,
  'Automatic', 'Petrol', 2,
  'available',
  'The Huracán distils four decades of Lamborghini racing heritage into a road car of extraordinary presence. Its naturally aspirated V10 delivers a sound and sensation unlike anything else on the Costa del Sol. Delivered to your hotel. Collected when you''re ready.',
  '[
    {"url": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80", "alt": "Lamborghini Huracán side profile"},
    {"url": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=80", "alt": "Lamborghini Huracán front detail"},
    {"url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80", "alt": "Marbella coastline drive"}
  ]',
  '["V10 naturally aspirated", "620 hp", "0–100 in 3.2s", "Carbon ceramic brakes", "Lifting system", "Bluetooth audio", "Reversing camera", "Sport exhaust"]'
),
(
  'range-rover-sport-2024',
  'Range Rover', 'Sport', 2024, 'suv',
  450, 5000,
  250, 0.50,
  25, 2,
  'Automatic', 'Hybrid', 5,
  'available',
  'The Range Rover Sport combines commanding presence with refined comfort across every terrain the Costa del Sol offers. Whether collecting guests from Málaga airport or heading into the Ronda mountains, it arrives with effortless authority.',
  '[
    {"url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600&q=80", "alt": "Range Rover Sport front"},
    {"url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1600&q=80", "alt": "Range Rover Sport interior"},
    {"url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1600&q=80", "alt": "Marbella mountain road"}
  ]',
  '["Plug-in hybrid", "Dynamic driving modes", "Panoramic sunroof", "Meridian sound system", "Air suspension", "360° camera", "Heated seats & steering", "5 seats with boot space"]'
);
