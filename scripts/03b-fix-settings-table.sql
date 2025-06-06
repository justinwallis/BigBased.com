-- Check if the column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'domain_settings' 
        AND column_name = 'setting_type'
    ) THEN
        ALTER TABLE domain_settings ADD COLUMN setting_type VARCHAR(50) DEFAULT 'general';
        CREATE INDEX IF NOT EXISTS idx_domain_settings_type ON domain_settings(setting_type);
        COMMENT ON COLUMN domain_settings.setting_type IS 'Type of setting: general, branding, features, billing';
    END IF;
END $$;
