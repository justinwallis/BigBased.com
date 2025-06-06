-- Create domain settings table for additional configuration
CREATE TABLE IF NOT EXISTS domain_settings (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  setting_key VARCHAR(255) NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'general', -- 'general', 'branding', 'features', 'billing'
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain_id, setting_key)
);

-- Create indexes for settings queries
CREATE INDEX IF NOT EXISTS idx_domain_settings_domain ON domain_settings(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_settings_key ON domain_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_domain_settings_type ON domain_settings(setting_type);

COMMENT ON TABLE domain_settings IS 'Flexible key-value settings for each domain';
COMMENT ON COLUMN domain_settings.is_encrypted IS 'Whether the setting value is encrypted';
