-- First, let's check the structure of the profiles table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Let's see what users exist and what columns we can use
SELECT * FROM profiles LIMIT 1;

-- Add admin role to your user (using id instead of email)
-- Replace 'your-user-id' with your actual user ID
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50);

UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id';

-- Verify the update worked
SELECT id, username, role 
FROM profiles 
WHERE role = 'admin';

-- If you don't know your user ID, find it first:
-- SELECT id, username FROM profiles ORDER BY created_at DESC LIMIT 10;
