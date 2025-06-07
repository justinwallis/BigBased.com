-- Compliance Automation Framework

-- Compliance Rules
CREATE TABLE IF NOT EXISTS compliance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  regulation_type VARCHAR(100) NOT NULL, -- GDPR, CCPA, ADA, WCAG, etc.
  rule_category VARCHAR(100), -- accessibility, privacy, content, etc.
  severity_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
  automated_check BOOLEAN DEFAULT true,
  check_frequency VARCHAR(50) DEFAULT 'on_publish', -- on_publish, daily, weekly, monthly
  rule_logic JSONB NOT NULL, -- the actual rule logic/configuration
  remediation_steps TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Scans
CREATE TABLE IF NOT EXISTS compliance_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_type VARCHAR(100) NOT NULL, -- full_site, content_item, page, etc.
  target_type VARCHAR(100) NOT NULL, -- content, page, site, etc.
  target_id UUID, -- reference to the scanned item
  scan_status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_checks INTEGER DEFAULT 0,
  passed_checks INTEGER DEFAULT 0,
  failed_checks INTEGER DEFAULT 0,
  warnings INTEGER DEFAULT 0,
  overall_score DECIMAL(3,2), -- 0.0 to 1.0
  scan_results JSONB DEFAULT '{}',
  triggered_by VARCHAR(100), -- manual, scheduled, auto_on_publish, etc.
  triggered_by_user UUID REFERENCES auth.users(id)
);

-- Compliance Issues
CREATE TABLE IF NOT EXISTS compliance_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES compliance_scans(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES compliance_rules(id),
  issue_type VARCHAR(100) NOT NULL,
  severity_level VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location TEXT, -- where the issue was found (URL, element selector, etc.)
  suggested_fix TEXT,
  auto_fixable BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, ignored
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Reports
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL, -- summary, detailed, regulatory, etc.
  regulation_types VARCHAR(100)[], -- which regulations this covers
  date_range_start TIMESTAMP WITH TIME ZONE,
  date_range_end TIMESTAMP WITH TIME ZONE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  report_data JSONB NOT NULL,
  file_path TEXT, -- path to generated PDF/document
  status VARCHAR(50) DEFAULT 'generated' -- generated, sent, archived
);

-- Compliance Remediation Workflows
CREATE TABLE IF NOT EXISTS compliance_remediation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_conditions JSONB NOT NULL, -- when this workflow should trigger
  workflow_steps JSONB NOT NULL, -- the steps in the workflow
  auto_execute BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_compliance_rules_regulation ON compliance_rules(regulation_type);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_active ON compliance_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_compliance_scans_status ON compliance_scans(scan_status);
CREATE INDEX IF NOT EXISTS idx_compliance_scans_target ON compliance_scans(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_scan ON compliance_issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_status ON compliance_issues(status);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_severity ON compliance_issues(severity_level);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_type ON compliance_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_date ON compliance_reports(generated_at);
