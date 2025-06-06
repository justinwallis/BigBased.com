-- Create domains table with full enterprise features
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

-- Index for fast domain lookups
CREATE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);
CREATE INDEX IF NOT EXISTS idx_domains_active ON domains(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_domains_owner ON domains(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_domains_site_type ON domains(site_type);

-- Create domain analytics table
CREATE TABLE IF NOT EXISTS domain_analytics (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  logins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domain_analytics_domain_date ON domain_analytics(domain_id, date);

-- Create domain settings table for additional configuration
CREATE TABLE IF NOT EXISTS domain_settings (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  setting_key VARCHAR(255) NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain_id, setting_key)
);

-- Insert your main domains
INSERT INTO domains (domain, site_type, is_active) VALUES 
('bigbased.com', 'bigbased', true),
('basedbook.com', 'basedbook', true)
ON CONFLICT (domain) DO NOTHING;
