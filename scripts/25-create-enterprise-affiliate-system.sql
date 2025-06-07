-- Enterprise Affiliate System - Complete Database Schema
-- This creates the most comprehensive affiliate management system

-- 1. Affiliate Programs Management
CREATE TABLE IF NOT EXISTS affiliate_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    program_type VARCHAR(50) DEFAULT 'standard', -- standard, mlm, hybrid, referral
    status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
    
    -- Commission Structure
    default_commission_rate DECIMAL(5,4) DEFAULT 0.0000,
    commission_type VARCHAR(50) DEFAULT 'percentage', -- percentage, fixed, tiered, performance
    commission_structure JSONB DEFAULT '{}',
    
    -- Program Settings
    cookie_duration INTEGER DEFAULT 30, -- days
    attribution_model VARCHAR(50) DEFAULT 'last_click', -- first_click, last_click, linear, time_decay
    min_payout_amount DECIMAL(10,2) DEFAULT 50.00,
    payout_frequency VARCHAR(50) DEFAULT 'monthly', -- weekly, bi-weekly, monthly, quarterly
    
    -- Geographic & Product Restrictions
    allowed_countries TEXT[], -- ISO country codes
    restricted_countries TEXT[],
    allowed_products JSONB DEFAULT '[]',
    restricted_products JSONB DEFAULT '[]',
    
    -- Compliance & Legal
    terms_url TEXT,
    privacy_policy_url TEXT,
    compliance_requirements JSONB DEFAULT '{}',
    tax_requirements JSONB DEFAULT '{}',
    
    -- Branding & Customization
    brand_settings JSONB DEFAULT '{}',
    custom_domain VARCHAR(255),
    white_label_enabled BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id)
);

-- 2. Affiliate Management
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Program Association
    program_id UUID REFERENCES affiliate_programs(id),
    tier_level INTEGER DEFAULT 1,
    parent_affiliate_id UUID REFERENCES affiliates(id), -- For MLM structure
    
    -- Status & Verification
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, suspended, terminated
    verification_status VARCHAR(50) DEFAULT 'unverified', -- unverified, pending, verified, rejected
    verification_documents JSONB DEFAULT '[]',
    
    -- Performance Metrics
    total_referrals INTEGER DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_commissions DECIMAL(12,2) DEFAULT 0.00,
    total_paid_commissions DECIMAL(12,2) DEFAULT 0.00,
    pending_commissions DECIMAL(12,2) DEFAULT 0.00,
    
    -- Personal Information
    business_name VARCHAR(255),
    tax_id VARCHAR(100),
    website_url TEXT,
    social_media_links JSONB DEFAULT '{}',
    
    -- Payment Information
    payment_method VARCHAR(50) DEFAULT 'bank_transfer', -- bank_transfer, paypal, stripe, crypto
    payment_details JSONB DEFAULT '{}', -- Encrypted payment info
    
    -- Geographic & Demographic
    country_code VARCHAR(3),
    state_province VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    -- Marketing Preferences
    marketing_categories TEXT[],
    promotional_methods TEXT[],
    target_audience JSONB DEFAULT '{}',
    
    -- Performance Tracking
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    average_order_value DECIMAL(10,2) DEFAULT 0.00,
    lifetime_value DECIMAL(12,2) DEFAULT 0.00,
    quality_score INTEGER DEFAULT 0, -- 0-100
    
    -- Dates
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    first_sale_at TIMESTAMP WITH TIME ZONE,
    last_sale_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Commission Structures & Tiers
CREATE TABLE IF NOT EXISTS commission_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES affiliate_programs(id),
    tier_name VARCHAR(100) NOT NULL,
    tier_level INTEGER NOT NULL,
    
    -- Qualification Requirements
    min_sales_volume DECIMAL(12,2) DEFAULT 0.00,
    min_referrals INTEGER DEFAULT 0,
    min_active_period INTEGER DEFAULT 0, -- days
    qualification_period INTEGER DEFAULT 30, -- days to maintain tier
    
    -- Commission Rates
    commission_rate DECIMAL(5,4) NOT NULL,
    bonus_rate DECIMAL(5,4) DEFAULT 0.0000,
    override_rate DECIMAL(5,4) DEFAULT 0.0000, -- For MLM overrides
    
    -- Tier Benefits
    benefits JSONB DEFAULT '{}',
    marketing_materials JSONB DEFAULT '[]',
    exclusive_offers JSONB DEFAULT '[]',
    
    -- Tier Settings
    auto_upgrade BOOLEAN DEFAULT true,
    auto_downgrade BOOLEAN DEFAULT false,
    grace_period INTEGER DEFAULT 30, -- days before downgrade
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tracking & Attribution
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Click Details
    click_id VARCHAR(100) UNIQUE NOT NULL,
    referral_url TEXT NOT NULL,
    landing_page TEXT,
    
    -- Visitor Information
    visitor_ip INET,
    user_agent TEXT,
    referrer TEXT,
    
    -- Geographic Data
    country_code VARCHAR(3),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Device & Browser
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    
    -- Attribution Data
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    
    -- Tracking
    session_id VARCHAR(255),
    cookie_value TEXT,
    fingerprint_hash VARCHAR(255),
    
    -- Conversion Tracking
    converted BOOLEAN DEFAULT false,
    conversion_id UUID,
    conversion_value DECIMAL(10,2) DEFAULT 0.00,
    conversion_time TIMESTAMP WITH TIME ZONE,
    
    -- Fraud Detection
    fraud_score INTEGER DEFAULT 0, -- 0-100
    fraud_flags JSONB DEFAULT '[]',
    is_suspicious BOOLEAN DEFAULT false,
    
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sales & Conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    click_id UUID REFERENCES affiliate_clicks(id),
    
    -- Order Information
    order_id VARCHAR(255),
    customer_id UUID,
    
    -- Conversion Details
    conversion_type VARCHAR(50) DEFAULT 'sale', -- sale, lead, signup, download
    conversion_value DECIMAL(12,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    
    -- Product Information
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    product_category VARCHAR(255),
    product_sku VARCHAR(255),
    
    -- Commission Calculation
    commission_rate DECIMAL(5,4) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, reversed
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Payment Tracking
    payout_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, pending, paid, failed
    payout_id UUID,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Attribution Details
    attribution_model VARCHAR(50),
    attribution_weight DECIMAL(3,2) DEFAULT 1.00,
    days_to_conversion INTEGER,
    
    -- Quality Metrics
    refunded BOOLEAN DEFAULT false,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    refund_date TIMESTAMP WITH TIME ZONE,
    chargeback BOOLEAN DEFAULT false,
    chargeback_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    conversion_metadata JSONB DEFAULT '{}',
    
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payouts & Payments
CREATE TABLE IF NOT EXISTS affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Payout Details
    payout_period_start DATE NOT NULL,
    payout_period_end DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Commission Breakdown
    sales_commission DECIMAL(12,2) DEFAULT 0.00,
    bonus_commission DECIMAL(12,2) DEFAULT 0.00,
    override_commission DECIMAL(12,2) DEFAULT 0.00,
    adjustments DECIMAL(12,2) DEFAULT 0.00,
    
    -- Deductions
    fees DECIMAL(10,2) DEFAULT 0.00,
    taxes DECIMAL(10,2) DEFAULT 0.00,
    chargebacks DECIMAL(10,2) DEFAULT 0.00,
    refunds DECIMAL(10,2) DEFAULT 0.00,
    
    -- Payment Processing
    payment_method VARCHAR(50) NOT NULL,
    payment_processor VARCHAR(100),
    transaction_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Failure Handling
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Documentation
    invoice_number VARCHAR(100),
    tax_document_url TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Marketing Materials
CREATE TABLE IF NOT EXISTS affiliate_marketing_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Material Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(50) NOT NULL, -- banner, text_link, email_template, landing_page, video, social_post
    category VARCHAR(100),
    
    -- Content
    content_url TEXT,
    thumbnail_url TEXT,
    html_code TEXT,
    text_content TEXT,
    
    -- Specifications
    dimensions VARCHAR(50), -- For banners: 728x90, 300x250, etc.
    file_size INTEGER, -- bytes
    file_format VARCHAR(20), -- jpg, png, gif, mp4, html
    
    -- Targeting & Restrictions
    target_audience JSONB DEFAULT '{}',
    geographic_restrictions TEXT[],
    tier_restrictions INTEGER[],
    
    -- Performance Tracking
    usage_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Compliance
    compliance_approved BOOLEAN DEFAULT false,
    compliance_notes TEXT,
    legal_disclaimers TEXT[],
    
    -- Availability
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, archived
    available_from TIMESTAMP WITH TIME ZONE,
    available_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- 8. Gamification & Incentives
CREATE TABLE IF NOT EXISTS affiliate_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Achievement Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    achievement_type VARCHAR(50) NOT NULL, -- milestone, streak, competition, seasonal
    category VARCHAR(100),
    
    -- Requirements
    requirements JSONB NOT NULL, -- Flexible requirements structure
    
    -- Rewards
    reward_type VARCHAR(50), -- commission_bonus, tier_upgrade, badge, prize, recognition
    reward_value DECIMAL(10,2) DEFAULT 0.00,
    reward_details JSONB DEFAULT '{}',
    
    -- Visual Elements
    badge_icon_url TEXT,
    badge_color VARCHAR(7), -- Hex color
    celebration_message TEXT,
    
    -- Availability
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    max_winners INTEGER, -- NULL for unlimited
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Affiliate Achievement Progress
CREATE TABLE IF NOT EXISTS affiliate_achievement_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    achievement_id UUID REFERENCES affiliate_achievements(id),
    
    -- Progress Tracking
    current_progress JSONB DEFAULT '{}',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, expired, reset
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Reward Status
    reward_claimed BOOLEAN DEFAULT false,
    reward_claimed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(affiliate_id, achievement_id)
);

-- 10. Communication & Notifications
CREATE TABLE IF NOT EXISTS affiliate_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Communication Details
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    communication_type VARCHAR(50) NOT NULL, -- announcement, newsletter, alert, promotion, training
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Targeting
    target_audience JSONB DEFAULT '{}', -- Tier levels, countries, performance criteria
    
    -- Delivery Settings
    delivery_method VARCHAR(50) DEFAULT 'email', -- email, sms, push, in_app, all
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- Content Variations
    subject_line VARCHAR(255),
    preview_text VARCHAR(255),
    html_content TEXT,
    plain_text_content TEXT,
    
    -- Tracking
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- 11. Fraud Detection & Prevention
CREATE TABLE IF NOT EXISTS affiliate_fraud_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Rule Details
    rule_name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- velocity, pattern, geographic, device, behavioral
    
    -- Rule Configuration
    rule_config JSONB NOT NULL,
    threshold_value DECIMAL(10,2),
    time_window INTEGER, -- minutes
    
    -- Actions
    action_type VARCHAR(50) NOT NULL, -- flag, block, suspend, alert, review
    severity_level INTEGER DEFAULT 1, -- 1-10
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Fraud Incidents
CREATE TABLE IF NOT EXISTS affiliate_fraud_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    rule_id UUID REFERENCES affiliate_fraud_rules(id),
    
    -- Incident Details
    incident_type VARCHAR(50) NOT NULL,
    severity_level INTEGER NOT NULL,
    description TEXT,
    
    -- Evidence
    evidence_data JSONB DEFAULT '{}',
    related_clicks UUID[],
    related_conversions UUID[],
    
    -- Investigation
    status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved, false_positive
    assigned_to UUID REFERENCES profiles(id),
    investigation_notes TEXT,
    
    -- Resolution
    resolution VARCHAR(50), -- dismissed, warning, suspension, termination, legal_action
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. API Keys & Integration
CREATE TABLE IF NOT EXISTS affiliate_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- API Key Details
    key_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    api_secret VARCHAR(255),
    
    -- Permissions
    permissions JSONB DEFAULT '[]', -- Array of allowed endpoints/actions
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    
    -- Usage Tracking
    total_requests INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    allowed_ips INET[],
    allowed_domains TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Performance Analytics
CREATE TABLE IF NOT EXISTS affiliate_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    date DATE NOT NULL,
    
    -- Traffic Metrics
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    
    -- Conversion Metrics
    conversions INTEGER DEFAULT 0,
    conversion_value DECIMAL(12,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Commission Metrics
    commissions_earned DECIMAL(10,2) DEFAULT 0.00,
    commissions_paid DECIMAL(10,2) DEFAULT 0.00,
    
    -- Quality Metrics
    refunds INTEGER DEFAULT 0,
    refund_value DECIMAL(10,2) DEFAULT 0.00,
    chargebacks INTEGER DEFAULT 0,
    chargeback_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- Geographic Breakdown
    top_countries JSONB DEFAULT '{}',
    top_regions JSONB DEFAULT '{}',
    
    -- Device Breakdown
    desktop_percentage DECIMAL(5,2) DEFAULT 0.00,
    mobile_percentage DECIMAL(5,2) DEFAULT 0.00,
    tablet_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(affiliate_id, program_id, date)
);

-- 15. Custom Landing Pages
CREATE TABLE IF NOT EXISTS affiliate_landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id),
    program_id UUID REFERENCES affiliate_programs(id),
    
    -- Page Details
    page_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    meta_description TEXT,
    
    -- Content
    html_content TEXT,
    css_styles TEXT,
    javascript_code TEXT,
    
    -- Configuration
    template_id UUID,
    custom_domain VARCHAR(255),
    
    -- A/B Testing
    is_variant BOOLEAN DEFAULT false,
    parent_page_id UUID REFERENCES affiliate_landing_pages(id),
    traffic_split DECIMAL(3,2) DEFAULT 1.00, -- 0.00 to 1.00
    
    -- Performance
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, archived
    published_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(affiliate_id, slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliates_program_id ON affiliates(program_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_parent_id ON affiliates(parent_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_status ON affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_converted_at ON affiliate_conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_analytics_date ON affiliate_analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_affiliate_analytics_affiliate_date ON affiliate_analytics_daily(affiliate_id, date);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_affiliate_commission(
    conversion_value DECIMAL,
    commission_rate DECIMAL,
    tier_bonus DECIMAL DEFAULT 0
) RETURNS DECIMAL AS $$
BEGIN
    RETURN ROUND((conversion_value * commission_rate) + tier_bonus, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_affiliate_tier_level(affiliate_id UUID)
RETURNS INTEGER AS $$
DECLARE
    tier_level INTEGER;
BEGIN
    SELECT a.tier_level INTO tier_level
    FROM affiliates a
    WHERE a.id = affiliate_id;
    
    RETURN COALESCE(tier_level, 1);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update affiliate statistics
CREATE OR REPLACE FUNCTION update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE affiliates 
        SET 
            total_sales = total_sales + NEW.conversion_value,
            total_commissions = total_commissions + NEW.commission_amount,
            total_referrals = total_referrals + 1,
            last_sale_at = NEW.converted_at,
            updated_at = NOW()
        WHERE id = NEW.affiliate_id;
        
        -- Set first sale date if this is the first sale
        UPDATE affiliates 
        SET first_sale_at = NEW.converted_at
        WHERE id = NEW.affiliate_id AND first_sale_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_stats
    AFTER INSERT OR UPDATE ON affiliate_conversions
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_stats();

-- Insert default affiliate program
INSERT INTO affiliate_programs (
    name,
    slug,
    description,
    program_type,
    default_commission_rate,
    commission_type,
    commission_structure,
    cookie_duration,
    min_payout_amount,
    payout_frequency
) VALUES (
    'BigBased Enterprise Affiliate Program',
    'bigbased-enterprise',
    'Comprehensive enterprise affiliate program with multi-tier commissions and advanced tracking',
    'hybrid',
    0.1500, -- 15% default commission
    'tiered',
    '{
        "tiers": [
            {"level": 1, "name": "Bronze", "rate": 0.15, "min_sales": 0},
            {"level": 2, "name": "Silver", "rate": 0.20, "min_sales": 10000},
            {"level": 3, "name": "Gold", "rate": 0.25, "min_sales": 50000},
            {"level": 4, "name": "Platinum", "rate": 0.30, "min_sales": 100000},
            {"level": 5, "name": "Diamond", "rate": 0.35, "min_sales": 250000}
        ]
    }',
    60, -- 60 day cookie
    100.00, -- $100 minimum payout
    'monthly'
) ON CONFLICT (slug) DO NOTHING;

-- Insert commission tiers
INSERT INTO commission_tiers (program_id, tier_name, tier_level, min_sales_volume, commission_rate, bonus_rate)
SELECT 
    ap.id,
    tier_data->>'name',
    (tier_data->>'level')::INTEGER,
    (tier_data->>'min_sales')::DECIMAL,
    (tier_data->>'rate')::DECIMAL,
    0.0000
FROM affiliate_programs ap,
     jsonb_array_elements(ap.commission_structure->'tiers') AS tier_data
WHERE ap.slug = 'bigbased-enterprise'
ON CONFLICT DO NOTHING;

-- Insert sample achievements
INSERT INTO affiliate_achievements (program_id, name, description, achievement_type, requirements, reward_type, reward_value)
SELECT 
    ap.id,
    'First Sale',
    'Complete your first successful referral',
    'milestone',
    '{"sales_count": 1}',
    'commission_bonus',
    50.00
FROM affiliate_programs ap
WHERE ap.slug = 'bigbased-enterprise'
ON CONFLICT DO NOTHING;

INSERT INTO affiliate_achievements (program_id, name, description, achievement_type, requirements, reward_type, reward_value)
SELECT 
    ap.id,
    'Sales Streak',
    'Generate sales for 7 consecutive days',
    'streak',
    '{"consecutive_days": 7, "min_sales_per_day": 1}',
    'commission_bonus',
    200.00
FROM affiliate_programs ap
WHERE ap.slug = 'bigbased-enterprise'
ON CONFLICT DO NOTHING;

-- Insert fraud detection rules
INSERT INTO affiliate_fraud_rules (program_id, rule_name, description, rule_type, rule_config, action_type, severity_level)
SELECT 
    ap.id,
    'High Click Velocity',
    'Detect unusually high click rates from single IP',
    'velocity',
    '{"max_clicks_per_hour": 100, "time_window": 60}',
    'flag',
    5
FROM affiliate_programs ap
WHERE ap.slug = 'bigbased-enterprise'
ON CONFLICT DO NOTHING;

INSERT INTO affiliate_fraud_rules (program_id, rule_name, description, rule_type, rule_config, action_type, severity_level)
SELECT 
    ap.id,
    'Self-Referral Detection',
    'Detect potential self-referrals based on patterns',
    'pattern',
    '{"same_ip_conversion": true, "time_threshold": 300}',
    'review',
    8
FROM affiliate_programs ap
WHERE ap.slug = 'bigbased-enterprise'
ON CONFLICT DO NOTHING;
