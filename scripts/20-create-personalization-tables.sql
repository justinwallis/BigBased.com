-- Personalization Engine

-- Audience Segments Table
CREATE TABLE IF NOT EXISTS cms_audience_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  segment_rules JSONB NOT NULL DEFAULT '{}', -- rules for segment membership
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Personalization Rules Table
CREATE TABLE IF NOT EXISTS cms_personalization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  segment_id UUID REFERENCES cms_audience_segments(id) ON DELETE CASCADE,
  rule_type VARCHAR(100) NOT NULL, -- show, hide, replace, etc.
  rule_data JSONB NOT NULL DEFAULT '{}', -- specific rule configuration
  priority INTEGER DEFAULT 0, -- higher number = higher priority
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Personalized Content Variants Table
CREATE TABLE IF NOT EXISTS cms_content_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  variant_content JSONB NOT NULL DEFAULT '{}',
  segment_id UUID REFERENCES cms_audience_segments(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- A/B Test Table
CREATE TABLE IF NOT EXISTS cms_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  test_objective VARCHAR(100) NOT NULL, -- conversion, engagement, etc.
  success_metric VARCHAR(100) NOT NULL, -- clicks, form submissions, etc.
  traffic_allocation INTEGER DEFAULT 50, -- percentage of traffic to test variant
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed, stopped
  winner_variant_id UUID, -- self-reference to winning variant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- A/B Test Variants Table
CREATE TABLE IF NOT EXISTS cms_ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES cms_ab_tests(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  variant_content JSONB NOT NULL DEFAULT '{}',
  is_control BOOLEAN DEFAULT false,
  impressions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalization Analytics Table
CREATE TABLE IF NOT EXISTS cms_personalization_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  variant_id UUID, -- can reference either content_variants or ab_test_variants
  segment_id UUID REFERENCES cms_audience_segments(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- impression, click, conversion, etc.
  user_id UUID, -- anonymous or authenticated user
  session_id VARCHAR(255),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_personalization_rules_content ON cms_personalization_rules(content_item_id);
CREATE INDEX IF NOT EXISTS idx_personalization_rules_segment ON cms_personalization_rules(segment_id);
CREATE INDEX IF NOT EXISTS idx_content_variants_content ON cms_content_variants(content_item_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_content ON cms_ab_tests(content_item_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test ON cms_ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_personalization_analytics_content ON cms_personalization_analytics(content_item_id);
CREATE INDEX IF NOT EXISTS idx_personalization_analytics_segment ON cms_personalization_analytics(segment_id);
CREATE INDEX IF NOT EXISTS idx_personalization_analytics_time ON cms_personalization_analytics(created_at);
