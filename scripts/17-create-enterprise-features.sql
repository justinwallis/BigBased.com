-- Redirects Management
CREATE TABLE IF NOT EXISTS cms_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path VARCHAR(2048) NOT NULL,
  destination_path VARCHAR(2048) NOT NULL,
  redirect_type INTEGER DEFAULT 301, -- 301, 302, 307, 308
  is_active BOOLEAN DEFAULT true,
  is_regex BOOLEAN DEFAULT false,
  description TEXT,
  hit_count INTEGER DEFAULT 0,
  last_hit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Content Workflows
CREATE TABLE IF NOT EXISTS cms_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS cms_workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES cms_workflows(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
  assignee_id UUID REFERENCES auth.users(id),
  comments JSONB DEFAULT '[]',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Content Scheduling
CREATE TABLE IF NOT EXISTS cms_scheduled_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- publish, unpublish, delete, archive
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, executed, failed, cancelled
  executed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Content Templates
CREATE TABLE IF NOT EXISTS cms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  template_data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Content Comments/Collaboration
CREATE TABLE IF NOT EXISTS cms_content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES cms_content_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  position_data JSONB, -- For inline comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Content Tags/Categories
CREATE TABLE IF NOT EXISTS cms_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7), -- Hex color
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS cms_content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES cms_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_item_id, tag_id)
);

-- Content Analytics
CREATE TABLE IF NOT EXISTS cms_content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- view, edit, publish, etc.
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Backups
CREATE TABLE IF NOT EXISTS cms_content_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  backup_data JSONB NOT NULL,
  backup_type VARCHAR(50) DEFAULT 'manual', -- manual, auto, scheduled
  file_path TEXT, -- For external backup storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- API Keys for headless access
CREATE TABLE IF NOT EXISTS cms_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Content Localization
CREATE TABLE IF NOT EXISTS cms_locales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE, -- en, es, fr, etc.
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  locale_id UUID REFERENCES cms_locales(id) ON DELETE CASCADE,
  translated_content JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, needs_review
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(content_item_id, locale_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cms_redirects_source ON cms_redirects(source_path);
CREATE INDEX IF NOT EXISTS idx_cms_redirects_active ON cms_redirects(is_active, source_path);
CREATE INDEX IF NOT EXISTS idx_cms_workflow_instances_content ON cms_workflow_instances(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cms_scheduled_actions_time ON cms_scheduled_actions(scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_cms_content_comments_item ON cms_content_comments(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_tags_item ON cms_content_tags(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_analytics_item ON cms_content_analytics(content_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_api_keys_hash ON cms_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_cms_content_translations_item ON cms_content_translations(content_item_id, locale_id);

-- Insert default locale
INSERT INTO cms_locales (code, name, is_default, is_active) VALUES
('en', 'English', true, true)
ON CONFLICT (code) DO NOTHING;
