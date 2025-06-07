-- Digital Asset Rights Management (Fixed)

-- First create the media_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- image, video, audio, document
  width INTEGER, -- for images/videos
  height INTEGER, -- for images/videos
  duration INTEGER, -- for videos/audio in seconds
  alt_text TEXT,
  caption TEXT,
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Licenses Table
CREATE TABLE IF NOT EXISTS cms_asset_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  license_type VARCHAR(100) NOT NULL, -- commercial, editorial, royalty-free, etc.
  provider VARCHAR(255), -- stock photo service, photographer, etc.
  terms TEXT, -- license terms
  restrictions TEXT, -- usage restrictions
  attribution_required BOOLEAN DEFAULT false,
  attribution_text TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  purchase_order_ref VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Asset License Usage Table
CREATE TABLE IF NOT EXISTS cms_asset_license_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
  license_id UUID REFERENCES cms_asset_licenses(id) ON DELETE SET NULL,
  content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  usage_type VARCHAR(100), -- website, social media, print, etc.
  usage_context TEXT, -- how the asset is being used
  usage_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_end_date TIMESTAMP WITH TIME ZONE, -- for temporary usage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- License Alerts Table
CREATE TABLE IF NOT EXISTS cms_license_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES cms_asset_licenses(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL, -- expiration, usage limit, etc.
  alert_message TEXT NOT NULL,
  alert_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_asset_licenses_expiration ON cms_asset_licenses(expiration_date);
CREATE INDEX IF NOT EXISTS idx_asset_license_usage_media ON cms_asset_license_usage(media_file_id);
CREATE INDEX IF NOT EXISTS idx_asset_license_usage_content ON cms_asset_license_usage(content_item_id);
CREATE INDEX IF NOT EXISTS idx_license_alerts_unresolved ON cms_license_alerts(is_resolved, alert_date);
