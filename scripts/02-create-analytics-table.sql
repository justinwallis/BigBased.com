-- Create domain analytics table for tracking metrics
CREATE TABLE IF NOT EXISTS domain_analytics (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  logins INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  top_pages JSONB DEFAULT '[]',
  referrer_data JSONB DEFAULT '{}',
  device_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_domain_analytics_domain_date ON domain_analytics(domain_id, date);
CREATE INDEX IF NOT EXISTS idx_domain_analytics_date ON domain_analytics(date);

-- Create unique constraint to prevent duplicate daily records
CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_analytics_unique_daily 
ON domain_analytics(domain_id, date);

COMMENT ON TABLE domain_analytics IS 'Daily analytics data for each domain';
