-- Create admin_logs table to track administrative actions
CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  target_user VARCHAR(255) NOT NULL,
  admin_user VARCHAR(255) NOT NULL,
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS admin_logs_action_idx ON admin_logs(action);
CREATE INDEX IF NOT EXISTS admin_logs_admin_user_idx ON admin_logs(admin_user);
CREATE INDEX IF NOT EXISTS admin_logs_target_user_idx ON admin_logs(target_user);
CREATE INDEX IF NOT EXISTS admin_logs_created_at_idx ON admin_logs(created_at);

-- Insert some sample admin actions
INSERT INTO admin_logs (action, target_user, admin_user, metadata, status, created_at)
VALUES 
('promote_admin', 'user2@example.com', 'admin@example.com', '{"note": "Promoted to help with domain management"}', 'success', NOW() - INTERVAL '1 hour'),
('reset_password', 'user1@example.com', 'admin@example.com', '{"reason": "User request"}', 'success', NOW() - INTERVAL '2 hours'),
('suspend_user', 'spammer@example.com', 'admin@example.com', '{"reason": "Spam activity", "duration": "7 days"}', 'success', NOW() - INTERVAL '1 day'),
('verify_email', 'newuser@example.com', 'admin@example.com', '{}', 'success', NOW() - INTERVAL '3 days'),
('delete_user', 'fake@example.com', 'admin@example.com', '{"reason": "Fake account"}', 'success', NOW() - INTERVAL '5 days');
