-- Check the structure of the profiles table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns 
WHERE 
  table_name = 'profiles' 
ORDER BY 
  ordinal_position;

-- Check the current data in profiles
SELECT * FROM profiles LIMIT 5;

-- Count orphaned profiles (for debugging)
WITH auth_users AS (
  SELECT id FROM auth.users
)
SELECT 
  COUNT(*) as orphaned_count
FROM 
  profiles p
WHERE 
  NOT EXISTS (SELECT 1 FROM auth_users a WHERE a.id = p.id);
