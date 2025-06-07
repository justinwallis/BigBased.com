-- Enterprise Integration Framework

-- Integration Connectors
CREATE TABLE IF NOT EXISTS integration_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  connector_type VARCHAR(100) NOT NULL, -- api, webhook, database, file, etc.
  system_type VARCHAR(100) NOT NULL, -- crm, erp, marketing, analytics, etc.
  vendor VARCHAR(255), -- Salesforce, HubSpot, SAP, etc.
  version VARCHAR(50),
  configuration JSONB NOT NULL, -- connection settings, credentials, etc.
  authentication_type VARCHAR(100), -- oauth, api_key, basic, certificate, etc.
  authentication_config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, error, testing
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency VARCHAR(50), -- real_time, hourly, daily, weekly, manual
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Data Mappings
CREATE TABLE IF NOT EXISTS integration_data_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES integration_connectors(id) ON DELETE CASCADE,
  mapping_name VARCHAR(255) NOT NULL,
  source_system VARCHAR(100) NOT NULL, -- cms, external
  target_system VARCHAR(100) NOT NULL, -- cms, external
  source_entity VARCHAR(255) NOT NULL, -- table/object name
  target_entity VARCHAR(255) NOT NULL, -- table/object name
  field_mappings JSONB NOT NULL, -- field-to-field mappings
  transformation_rules JSONB DEFAULT '{}', -- data transformation logic
  sync_direction VARCHAR(50) DEFAULT 'bidirectional', -- inbound, outbound, bidirectional
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Events
CREATE TABLE IF NOT EXISTS integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES integration_connectors(id),
  event_type VARCHAR(100) NOT NULL, -- sync, webhook, error, etc.
  event_source VARCHAR(100) NOT NULL, -- system that triggered the event
  event_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Jobs
CREATE TABLE IF NOT EXISTS integration_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES integration_connectors(id) ON DELETE CASCADE,
  job_type VARCHAR(100) NOT NULL, -- full_sync, incremental, real_time
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed, cancelled
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  sync_direction VARCHAR(50), -- inbound, outbound, bidirectional
  job_config JSONB DEFAULT '{}',
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- API Gateway Logs
CREATE TABLE IF NOT EXISTS integration_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES integration_connectors(id),
  request_method VARCHAR(10) NOT NULL,
  request_url TEXT NOT NULL,
  request_headers JSONB DEFAULT '{}',
  request_body TEXT,
  response_status INTEGER,
  response_headers JSONB DEFAULT '{}',
  response_body TEXT,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Automations
CREATE TABLE IF NOT EXISTS integration_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL, -- event, schedule, manual, webhook
  trigger_config JSONB NOT NULL,
  workflow_steps JSONB NOT NULL, -- array of workflow steps
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  success_rate DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_integration_connectors_type ON integration_connectors(connector_type);
CREATE INDEX IF NOT EXISTS idx_integration_connectors_status ON integration_connectors(status);
CREATE INDEX IF NOT EXISTS idx_integration_data_mappings_connector ON integration_data_mappings(connector_id);
CREATE INDEX IF NOT EXISTS idx_integration_events_connector ON integration_events(connector_id);
CREATE INDEX IF NOT EXISTS idx_integration_events_status ON integration_events(status);
CREATE INDEX IF NOT EXISTS idx_integration_sync_jobs_connector ON integration_sync_jobs(connector_id);
CREATE INDEX IF NOT EXISTS idx_integration_sync_jobs_status ON integration_sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_integration_api_logs_connector ON integration_api_logs(connector_id);
CREATE INDEX IF NOT EXISTS idx_integration_api_logs_created ON integration_api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_integration_workflows_active ON integration_workflows(is_active);
