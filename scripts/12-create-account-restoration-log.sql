-- Create a table to track account restorations
CREATE TABLE IF NOT EXISTS account_restorations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  restored_by TEXT NOT NULL,
  restored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  previous_email TEXT,
  new_email TEXT NOT NULL,
  notes TEXT
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_restorations_user_id ON account_restorations(user_id);
