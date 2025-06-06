-- Create domains table with full enterprise features
-- This is completely additive and won't affect existing data
CREATE TABLE IF NOT EXISTS domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  site_type VARCHAR(50) NOT NULL DEFAULT 'bigbased', -- 'bigbased', 'basedbook', 'custom'
  is_active BOOLEAN DEFAULT true,
  custom_branding JSONB DEFAULT '{}', -- Store custom logos, colors, etc.
  owner_user_id UUID REFERENCES auth.users(id), -- Domain ownership
  owner_email VARCHAR(255),
  owner_name VARCHAR(255),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast domain lookups
CREATE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);
CREATE INDEX IF NOT EXISTS idx_domains_active ON domains(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_domains_owner ON domains(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_domains_site_type ON domains(site_type);

-- Add comments for documentation
COMMENT ON TABLE domains IS 'Multi-tenant domain configuration and management';
COMMENT ON COLUMN domains.site_type IS 'Type of site: bigbased, basedbook, or custom';
COMMENT ON COLUMN domains.custom_branding IS 'JSON object containing custom branding settings';
