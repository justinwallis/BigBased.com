-- Fix the admin_logs table structure
ALTER TABLE admin_logs 
DROP COLUMN IF EXISTS metadata,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Update the table structure to match what we're using
ALTER TABLE admin_logs 
ALTER COLUMN details SET DEFAULT '';

-- Check the current structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_logs' 
AND table_schema = 'public'
ORDER BY ordinal_position;
