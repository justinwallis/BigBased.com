-- Fix admin_logs table structure
ALTER TABLE admin_logs 
DROP COLUMN IF EXISTS metadata,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Ensure all required columns exist
ALTER TABLE admin_logs 
ADD COLUMN IF NOT EXISTS action VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS target_user VARCHAR(255),
ADD COLUMN IF NOT EXISTS admin_user VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'success',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
