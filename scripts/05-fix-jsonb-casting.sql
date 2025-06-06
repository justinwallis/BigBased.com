-- Fix the JSONB casting issues and add missing columns

-- First, add the missing is_encrypted column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'domain_settings' 
        AND column_name = 'is_encrypted'
    ) THEN
        ALTER TABLE domain_settings ADD COLUMN is_encrypted BOOLEAN DEFAULT false;
        COMMENT ON COLUMN domain_settings.is_encrypted IS 'Whether the setting value is encrypted';
    END IF;
END $$;

-- Now insert the settings with proper JSONB casting
INSERT INTO domain_settings (domain_id, setting_key, setting_value, setting_type) 
SELECT 
  d.id,
  'default_theme',
  '{"primaryColor": "#1a365d", "secondaryColor": "#2d3748", "accentColor": "#3182ce"}'::jsonb,
  'branding'
FROM domains d 
WHERE d.domain IN ('bigbased.com', 'basedbook.com')
ON CONFLICT (domain_id, setting_key) DO NOTHING;

-- Add feature flags with proper JSONB casting
INSERT INTO domain_settings (domain_id, setting_key, setting_value, setting_type)
SELECT 
  d.id,
  'enabled_features',
  CASE 
    WHEN d.site_type = 'bigbased' THEN '["voting", "revolution", "transform", "features", "partners"]'::jsonb
    WHEN d.site_type = 'basedbook' THEN '["library", "authors", "collections", "reading"]'::jsonb
    ELSE '["basic"]'::jsonb
  END,
  'features'
FROM domains d 
WHERE d.domain IN ('bigbased.com', 'basedbook.com')
ON CONFLICT (domain_id, setting_key) DO NOTHING;

-- Add some additional useful settings
INSERT INTO domain_settings (domain_id, setting_key, setting_value, setting_type)
SELECT 
  d.id,
  'site_config',
  CASE 
    WHEN d.site_type = 'bigbased' THEN '{"showVoting": true, "showRevolution": true, "showTransform": true}'::jsonb
    WHEN d.site_type = 'basedbook' THEN '{"showLibrary": true, "showAuthors": true, "showBooks": true}'::jsonb
    ELSE '{}'::jsonb
  END,
  'features'
FROM domains d 
WHERE d.domain IN ('bigbased.com', 'basedbook.com')
ON CONFLICT (domain_id, setting_key) DO NOTHING;
