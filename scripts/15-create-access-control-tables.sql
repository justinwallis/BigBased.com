-- Create roles table
CREATE TABLE IF NOT EXISTS cms_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles junction table
CREATE TABLE IF NOT EXISTS cms_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, role_id)
);

-- Create content permissions table
CREATE TABLE IF NOT EXISTS cms_content_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  user_id UUID,
  role_id UUID REFERENCES cms_roles(id) ON DELETE CASCADE,
  permission_type VARCHAR(50) NOT NULL, -- 'read', 'write', 'delete', 'publish'
  granted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (content_type_id IS NOT NULL OR content_item_id IS NOT NULL),
  CHECK (user_id IS NOT NULL OR role_id IS NOT NULL)
);

-- Create hooks table for event system
CREATE TABLE IF NOT EXISTS cms_hooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'content.created', 'content.updated', etc.
  endpoint_url TEXT,
  http_method VARCHAR(10) DEFAULT 'POST',
  headers JSONB DEFAULT '{}',
  payload_template JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hook executions log
CREATE TABLE IF NOT EXISTS cms_hook_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_id UUID NOT NULL REFERENCES cms_hooks(id) ON DELETE CASCADE,
  event_data JSONB NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'success', 'failed', 'retrying'
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  retry_attempt INTEGER DEFAULT 0
);

-- Insert default roles
INSERT INTO cms_roles (name, description, permissions, is_system_role) VALUES
('Super Admin', 'Full access to all CMS features', '{
  "content": ["create", "read", "update", "delete", "publish"],
  "media": ["upload", "delete", "organize"],
  "users": ["manage", "assign_roles"],
  "settings": ["manage"],
  "hooks": ["manage"],
  "analytics": ["view"]
}', true),
('Editor', 'Can create and edit content', '{
  "content": ["create", "read", "update", "publish"],
  "media": ["upload", "organize"]
}', true),
('Author', 'Can create and edit own content', '{
  "content": ["create", "read", "update"],
  "media": ["upload"]
}', true),
('Viewer', 'Read-only access to content', '{
  "content": ["read"]
}', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cms_user_roles_user_id ON cms_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_cms_user_roles_role_id ON cms_user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_permissions_content_type ON cms_content_permissions(content_type_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_permissions_content_item ON cms_content_permissions(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cms_hooks_event_type ON cms_hooks(event_type);
CREATE INDEX IF NOT EXISTS idx_cms_hook_executions_hook_id ON cms_hook_executions(hook_id);
CREATE INDEX IF NOT EXISTS idx_cms_hook_executions_status ON cms_hook_executions(status);
