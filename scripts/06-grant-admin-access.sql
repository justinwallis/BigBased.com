-- Grant admin access to current user
-- This script adds admin role to your profile

-- First, let's see what users exist
SELECT id, email, username FROM profiles LIMIT 5;

-- Add admin role to your user (replace with your actual email)
-- You'll need to replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the update worked
SELECT id, email, username, role 
FROM profiles 
WHERE role = 'admin';

-- If you don't know your email, find it first:
-- SELECT id, email, username, role FROM profiles WHERE email LIKE '%your-domain%';
