-- Run this AFTER creating an auth user in Supabase Dashboard
-- (Authentication > Users > Add user > your email + password)
--
-- Replace 'your@email.com' with the email you used to create the auth user.

INSERT INTO admin_users (id, full_name)
SELECT id, 'Owner'
FROM auth.users
WHERE email = 'waxeee57@gmail.com'
ON CONFLICT (id) DO NOTHING;
