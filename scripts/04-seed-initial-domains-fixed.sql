-- Seed the domains table with your main domains
-- This establishes your existing domains in the new system
INSERT INTO domains (domain, site_type, is_active, owner_email, owner_name, notes) VALUES 
('bigbased.com', 'bigbased', true, 'admin@bigbased.com', 'BigBased Admin', 'Main BigBased platform'),
('basedbook.com', 'basedbook', true, 'admin@bigbased.com', 'BigBased Admin', 'Digital library platform'),
('www.bigbased.com', 'bigbased', true, 'admin@bigbased.com', 'BigBased Admin', 'WWW redirect for BigBased'),
('www.basedbook.com', 'basedbook', true, 'admin@bigbased.com', 'BigBased Admin', 'WWW redirect for BasedBook')
ON CONFLICT (domain) DO NOTHING;

-- Add some default settings for the main domains (without setting_type if it doesn't exist)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'domain_settings' 
        AND column_name = 'setting_type'
    ) THEN
        -- With setting_type column
        INSERT INTO domain_settings (domain_id, setting_key, setting_value, setting_type) 
        SELECT 
          d.id,
          'default_theme',
          '{"primaryColor": "#1a365d", "secondaryColor": "#2d3748", "accentColor": "#3182ce"}',
          'branding'
        FROM domains d 
        WHERE d.domain IN ('bigbased.com', 'basedbook.com')
        ON CONFLICT (domain_id, setting_key) DO NOTHING;
        
        -- Add feature flags for the main domains
        INSERT INTO domain_settings (domain_id, setting_key, setting_value, setting_type)
        SELECT 
          d.id,
          'enabled_features',
          CASE 
            WHEN d.site_type = 'bigbased' THEN '["voting", "revolution", "transform", "features", "partners"]'
            WHEN d.site_type = 'basedbook' THEN '["library", "authors", "collections", "reading"]'
            ELSE '["basic"]'
          END,
          'features'
        FROM domains d 
        WHERE d.domain IN ('bigbased.com', 'basedbook.com')
        ON CONFLICT (domain_id, setting_key) DO NOTHING;
    ELSE
        -- Without setting_type column
        INSERT INTO domain_settings (domain_id, setting_key, setting_value) 
        SELECT 
          d.id,
          'default_theme',
          '{"primaryColor": "#1a365d", "secondaryColor": "#2d3748", "accentColor": "#3182ce"}'
        FROM domains d 
        WHERE d.domain IN ('bigbased.com', 'basedbook.com')
        ON CONFLICT (domain_id, setting_key) DO NOTHING;
        
        -- Add feature flags for the main domains
        INSERT INTO domain_settings (domain_id, setting_key, setting_value)
        SELECT 
          d.id,
          'enabled_features',
          CASE 
            WHEN d.site_type = 'bigbased' THEN '["voting", "revolution", "transform", "features", "partners"]'
            WHEN d.site_type = 'basedbook' THEN '["library", "authors", "collections", "reading"]'
            ELSE '["basic"]'
          END
        FROM domains d 
        WHERE d.domain IN ('bigbased.com', 'basedbook.com')
        ON CONFLICT (domain_id, setting_key) DO NOTHING;
    END IF;
END $$;
