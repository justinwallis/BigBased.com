-- Ensure content_types table exists
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  schema JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Ensure content_items table exists
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  featured_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(content_type_id, slug)
);

-- Now create the access control tables
CREATE TABLE IF NOT EXISTS cms_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES cms_roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS cms_hooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  endpoint_url TEXT,
  http_method VARCHAR(10) DEFAULT 'POST',
  headers JSONB DEFAULT '{}',
  payload_template JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS cms_hook_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_id UUID REFERENCES cms_hooks(id) ON DELETE CASCADE,
  event_data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending',
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  execution_time_ms INTEGER,
  retry_attempt INTEGER DEFAULT 0,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO cms_roles (name, description, permissions, is_system_role) VALUES
('Super Admin', 'Full access to all CMS features', '{
  "content": ["create", "read", "update", "delete", "publish"],
  "media": ["upload", "delete", "organize"],
  "users": ["manage", "assign_roles"],
  "settings": ["manage"],
  "hooks": ["manage"],
  "redirects": ["manage"],
  "analytics": ["view"],
  "workflows": ["manage"]
}', true),
('Editor', 'Can manage content and media', '{
  "content": ["create", "read", "update", "delete", "publish"],
  "media": ["upload", "delete", "organize"],
  "analytics": ["view"]
}', true),
('Author', 'Can create and edit own content', '{
  "content": ["create", "read", "update"],
  "media": ["upload"],
  "analytics": ["view"]
}', true),
('Viewer', 'Read-only access', '{
  "content": ["read"],
  "media": ["read"],
  "analytics": ["view"]
}', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cms_user_roles_user ON cms_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_cms_user_roles_role ON cms_user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_cms_hooks_event ON cms_hooks(event_type, is_active);
CREATE INDEX IF NOT EXISTS idx_cms_hook_executions_hook ON cms_hook_executions(hook_id, executed_at DESC);
