-- Enterprise Multi-Tenant E-Commerce System
-- This script creates all necessary tables for a complete multi-tenant shop system

-- =============================================
-- CORE SHOP TABLES
-- =============================================

-- Shops table - Core configuration for each tenant shop
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  domain_id INTEGER REFERENCES domains(id),
  custom_domain VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  primary_color VARCHAR(20),
  accent_color VARCHAR(20),
  font_family VARCHAR(100),
  theme_settings JSONB DEFAULT '{}',
  business_email VARCHAR(255),
  support_email VARCHAR(255),
  business_phone VARCHAR(50),
  business_address JSONB,
  social_links JSONB,
  seo_settings JSONB,
  legal_settings JSONB,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'closed')),
  verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  plan_id UUID,
  features_enabled JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shops_owner ON shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);
CREATE INDEX IF NOT EXISTS idx_shops_domain ON shops(domain_id);
CREATE INDEX IF NOT EXISTS idx_shops_status ON shops(status);

-- Shop Staff - Additional users who can manage a shop
CREATE TABLE IF NOT EXISTS shop_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'staff', 'support', 'analyst', 'marketer')),
  permissions JSONB DEFAULT '{}',
  invitation_status VARCHAR(20) DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'accepted', 'declined')),
  invitation_email VARCHAR(255),
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  invitation_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_shop_staff_shop ON shop_staff(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_staff_user ON shop_staff(user_id);

-- Shop Plans - Different tiers of shop functionality
CREATE TABLE IF NOT EXISTS shop_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  billing_interval VARCHAR(20) CHECK (billing_interval IN ('monthly', 'quarterly', 'annual', 'lifetime')),
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  trial_days INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop Subscriptions - Track shop plan subscriptions
CREATE TABLE IF NOT EXISTS shop_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES shop_plans(id),
  status VARCHAR(20) CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'paused')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  payment_method_id VARCHAR(255),
  external_subscription_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_subscriptions_shop ON shop_subscriptions(shop_id);

-- =============================================
-- PRODUCT MANAGEMENT
-- =============================================

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES product_categories(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  icon VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  seo_title VARCHAR(100),
  seo_description TEXT,
  seo_keywords TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_shop ON product_categories(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON product_categories(parent_id);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  sku VARCHAR(100),
  barcode VARCHAR(100),
  is_physical BOOLEAN DEFAULT true,
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(10) DEFAULT 'kg',
  dimensions JSONB,
  requires_shipping BOOLEAN DEFAULT true,
  is_taxable BOOLEAN DEFAULT true,
  tax_code VARCHAR(50),
  inventory_management BOOLEAN DEFAULT true,
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy VARCHAR(20) DEFAULT 'deny' CHECK (inventory_policy IN ('deny', 'continue')),
  fulfillment_service VARCHAR(50) DEFAULT 'manual',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  vendor VARCHAR(100),
  product_type VARCHAR(100),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  seo_title VARCHAR(100),
  seo_description TEXT,
  seo_keywords TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  width INTEGER,
  height INTEGER,
  size INTEGER,
  position INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(10) DEFAULT 'kg',
  dimensions JSONB,
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy VARCHAR(20) DEFAULT 'deny' CHECK (inventory_policy IN ('deny', 'continue')),
  option1_name VARCHAR(100),
  option1_value VARCHAR(100),
  option2_name VARCHAR(100),
  option2_value VARCHAR(100),
  option3_name VARCHAR(100),
  option3_value VARCHAR(100),
  image_url TEXT,
  is_default BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

-- Product Category Relationships
CREATE TABLE IF NOT EXISTS product_category_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_category_product ON product_category_relationships(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_category ON product_category_relationships(category_id);

-- Product Options (for configurable products)
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_options_product ON product_options(product_id);

-- Product Option Values
CREATE TABLE IF NOT EXISTS product_option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_option_values_option ON product_option_values(option_id);

-- =============================================
-- CUSTOMER MANAGEMENT
-- =============================================

-- Shop Customers - Extended profile for shop customers
CREATE TABLE IF NOT EXISTS shop_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  accepts_marketing BOOLEAN DEFAULT false,
  marketing_opt_in_level VARCHAR(50),
  marketing_opt_in_date TIMESTAMP WITH TIME ZONE,
  note TEXT,
  tags TEXT[],
  tax_exempt BOOLEAN DEFAULT false,
  tax_exemption_type VARCHAR(100),
  verified_email BOOLEAN DEFAULT false,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  last_order_id UUID,
  last_order_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, email)
);

CREATE INDEX IF NOT EXISTS idx_shop_customers_shop ON shop_customers(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_customers_user ON shop_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_customers_email ON shop_customers(email);

-- Customer Addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES shop_customers(id) ON DELETE CASCADE,
  address_type VARCHAR(20) CHECK (address_type IN ('billing', 'shipping', 'both')),
  is_default_billing BOOLEAN DEFAULT false,
  is_default_shipping BOOLEAN DEFAULT false,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(100),
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(2),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer ON customer_addresses(customer_id);

-- Customer Groups
CREATE TABLE IF NOT EXISTS customer_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_defined BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_groups_shop ON customer_groups(shop_id);

-- Customer Group Memberships
CREATE TABLE IF NOT EXISTS customer_group_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES customer_groups(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES shop_customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_group_memberships_group ON customer_group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_customer_group_memberships_customer ON customer_group_memberships(customer_id);

-- =============================================
-- ORDER MANAGEMENT
-- =============================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES shop_customers(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  financial_status VARCHAR(50) DEFAULT 'pending' CHECK (financial_status IN ('pending', 'authorized', 'partially_paid', 'paid', 'partially_refunded', 'refunded', 'voided')),
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partially_fulfilled', 'fulfilled', 'restocked', 'pending_fulfillment')),
  currency VARCHAR(3) DEFAULT 'USD',
  subtotal_price DECIMAL(10, 2) NOT NULL,
  total_discounts DECIMAL(10, 2) DEFAULT 0,
  total_shipping DECIMAL(10, 2) DEFAULT 0,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  total_weight DECIMAL(10, 2) DEFAULT 0,
  billing_address JSONB,
  shipping_address JSONB,
  shipping_method VARCHAR(100),
  shipping_carrier VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  note TEXT,
  customer_note TEXT,
  staff_note TEXT,
  tags TEXT[],
  source VARCHAR(50) DEFAULT 'web',
  device_id VARCHAR(100),
  browser_ip VARCHAR(50),
  user_agent TEXT,
  referring_site TEXT,
  landing_site TEXT,
  checkout_token VARCHAR(100),
  cart_token VARCHAR(100),
  payment_gateway VARCHAR(100),
  payment_method_details JSONB,
  transaction_id VARCHAR(100),
  processed_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason VARCHAR(100),
  refunded_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_processed_at ON orders(processed_at);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  variant_title VARCHAR(255),
  sku VARCHAR(100),
  barcode VARCHAR(100),
  vendor VARCHAR(100),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  total_discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(10) DEFAULT 'kg',
  requires_shipping BOOLEAN DEFAULT true,
  tax_lines JSONB,
  discount_allocations JSONB,
  properties JSONB,
  image_url TEXT,
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
  fulfillment_id UUID,
  refunded_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON order_items(variant_id);

-- Order Transactions
CREATE TABLE IF NOT EXISTS order_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  kind VARCHAR(50) CHECK (kind IN ('sale', 'capture', 'authorization', 'void', 'refund')),
  status VARCHAR(50) CHECK (status IN ('pending', 'success', 'failure', 'error')),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  gateway VARCHAR(100),
  payment_method VARCHAR(100),
  payment_method_details JSONB,
  transaction_id VARCHAR(100),
  authorization_id VARCHAR(100),
  error_code VARCHAR(100),
  error_message TEXT,
  gateway_response JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_transactions_order ON order_transactions(order_id);

-- Order Fulfillments
CREATE TABLE IF NOT EXISTS order_fulfillments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('pending', 'success', 'cancelled', 'error')),
  tracking_company VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  fulfillment_service VARCHAR(100),
  shipment_status VARCHAR(50),
  location_id VARCHAR(100),
  line_items JSONB,
  receipt JSONB,
  note TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_fulfillments_order ON order_fulfillments(order_id);

-- Order Refunds
CREATE TABLE IF NOT EXISTS order_refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  reason VARCHAR(100),
  note TEXT,
  refund_line_items JSONB,
  transactions JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_refunds_order ON order_refunds(order_id);

-- =============================================
-- DISCOUNTS & PROMOTIONS
-- =============================================

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  code VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y')),
  value DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2),
  maximum_discount_amount DECIMAL(10, 2),
  applies_to_resource VARCHAR(50) CHECK (applies_to_resource IN ('all_products', 'specific_products', 'specific_collections')),
  applies_to_ids TEXT[],
  excludes_resource VARCHAR(50) CHECK (excludes_resource IN ('none', 'specific_products', 'specific_collections')),
  excludes_ids TEXT[],
  customer_eligibility VARCHAR(50) DEFAULT 'all' CHECK (customer_eligibility IN ('all', 'specific_customers', 'specific_groups')),
  customer_ids TEXT[],
  customer_group_ids TEXT[],
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  once_per_customer BOOLEAN DEFAULT false,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'expired', 'scheduled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, code)
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_shop ON discount_codes(shop_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_status ON discount_codes(status);

-- Automatic Discounts
CREATE TABLE IF NOT EXISTS automatic_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y')),
  value DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2),
  maximum_discount_amount DECIMAL(10, 2),
  applies_to_resource VARCHAR(50) CHECK (applies_to_resource IN ('all_products', 'specific_products', 'specific_collections')),
  applies_to_ids TEXT[],
  excludes_resource VARCHAR(50) CHECK (excludes_resource IN ('none', 'specific_products', 'specific_collections')),
  excludes_ids TEXT[],
  customer_eligibility VARCHAR(50) DEFAULT 'all' CHECK (customer_eligibility IN ('all', 'specific_customers', 'specific_groups')),
  customer_ids TEXT[],
  customer_group_ids TEXT[],
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'expired', 'scheduled')),
  priority INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automatic_discounts_shop ON automatic_discounts(shop_id);
CREATE INDEX IF NOT EXISTS idx_automatic_discounts_status ON automatic_discounts(status);

-- =============================================
-- SHIPPING & TAX
-- =============================================

-- Shipping Zones
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  countries TEXT[],
  states TEXT[],
  zip_codes TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_zones_shop ON shipping_zones(shop_id);

-- Shipping Rates
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rate_type VARCHAR(50) CHECK (rate_type IN ('price_based', 'weight_based', 'flat', 'free', 'calculated')),
  price DECIMAL(10, 2),
  min_order_amount DECIMAL(10, 2),
  max_order_amount DECIMAL(10, 2),
  min_weight DECIMAL(10, 2),
  max_weight DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  conditions JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON shipping_rates(zone_id);

-- Tax Rates
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rate DECIMAL(6, 4) NOT NULL,
  country VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  product_tax_code VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_rates_shop ON tax_rates(shop_id);

-- =============================================
-- SHOP CONTENT & CUSTOMIZATION
-- =============================================

-- Shop Pages
CREATE TABLE IF NOT EXISTS shop_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  excerpt TEXT,
  template VARCHAR(100) DEFAULT 'default',
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden')),
  featured_image_url TEXT,
  seo_title VARCHAR(100),
  seo_description TEXT,
  seo_keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  show_in_navigation BOOLEAN DEFAULT false,
  password VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(shop_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_shop_pages_shop ON shop_pages(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_pages_status ON shop_pages(status);

-- Shop Navigation
CREATE TABLE IF NOT EXISTS shop_navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  location VARCHAR(50) CHECK (location IN ('main_menu', 'footer', 'secondary_menu', 'mobile_menu', 'utility_menu')),
  title VARCHAR(100) NOT NULL,
  url TEXT,
  resource_type VARCHAR(50),
  resource_id UUID,
  parent_id UUID REFERENCES shop_navigation(id),
  position INTEGER DEFAULT 0,
  opens_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_navigation_shop ON shop_navigation(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_navigation_location ON shop_navigation(location);
CREATE INDEX IF NOT EXISTS idx_shop_navigation_parent ON shop_navigation(parent_id);

-- Shop Theme Templates
CREATE TABLE IF NOT EXISTS shop_theme_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('product', 'collection', 'page', 'blog', 'article', 'cart', 'checkout', 'customer')),
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_theme_templates_shop ON shop_theme_templates(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_theme_templates_type ON shop_theme_templates(type);

-- Shop Assets (CSS, JS, images)
CREATE TABLE IF NOT EXISTS shop_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  file_url TEXT,
  content_type VARCHAR(100),
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, key)
);

CREATE INDEX IF NOT EXISTS idx_shop_assets_shop ON shop_assets(shop_id);

-- =============================================
-- ANALYTICS & REPORTING
-- =============================================

-- Shop Analytics
CREATE TABLE IF NOT EXISTS shop_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5, 2),
  avg_session_duration INTEGER,
  transactions INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  conversion_rate DECIMAL(5, 2),
  cart_abandonment_rate DECIMAL(5, 2),
  top_products JSONB,
  top_categories JSONB,
  traffic_sources JSONB,
  device_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, date)
);

CREATE INDEX IF NOT EXISTS idx_shop_analytics_shop ON shop_analytics(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_analytics_date ON shop_analytics(date);

-- Product Analytics
CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  add_to_carts INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  refunds INTEGER DEFAULT 0,
  refund_amount DECIMAL(12, 2) DEFAULT 0,
  conversion_rate DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX IF NOT EXISTS idx_product_analytics_shop ON product_analytics(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product ON product_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date);

-- =============================================
-- INVENTORY MANAGEMENT
-- =============================================

-- Inventory Locations
CREATE TABLE IF NOT EXISTS inventory_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  address JSONB,
  is_active BOOLEAN DEFAULT true,
  is_fulfillment_location BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_locations_shop ON inventory_locations(shop_id);

-- Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  cost DECIMAL(10, 2),
  available_quantity INTEGER DEFAULT 0,
  committed_quantity INTEGER DEFAULT 0,
  incoming_quantity INTEGER DEFAULT 0,
  reorder_point INTEGER,
  restock_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(variant_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_shop ON inventory_items(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_variant ON inventory_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);

-- Inventory Levels
CREATE TABLE IF NOT EXISTS inventory_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  location_id UUID REFERENCES inventory_locations(id) ON DELETE CASCADE,
  available_quantity INTEGER DEFAULT 0,
  committed_quantity INTEGER DEFAULT 0,
  incoming_quantity INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(inventory_item_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_levels_item ON inventory_levels(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_levels_location ON inventory_levels(location_id);

-- Inventory Adjustments
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  location_id UUID REFERENCES inventory_locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  reason VARCHAR(100),
  reference_type VARCHAR(50),
  reference_id UUID,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_shop ON inventory_adjustments(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_item ON inventory_adjustments(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_location ON inventory_adjustments(location_id);

-- =============================================
-- REVIEWS & RATINGS
-- =============================================

-- Product Reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES shop_customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  content TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  admin_response TEXT,
  admin_response_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_shop ON product_reviews(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);

-- Review Images
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_images_review ON review_images(review_id);

-- =============================================
-- MARKETING & COMMUNICATIONS
-- =============================================

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('order_confirmation', 'shipping_confirmation', 'abandoned_cart', 'customer_welcome', 'password_reset', 'custom')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_shop ON email_templates(shop_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) CHECK (type IN ('email', 'sms', 'push', 'social', 'retargeting')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
  audience_type VARCHAR(50),
  audience_filter JSONB,
  content JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  stats JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_shop ON marketing_campaigns(shop_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);

-- Abandoned Carts
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES shop_customers(id) ON DELETE SET NULL,
  email VARCHAR(255),
  token VARCHAR(100) NOT NULL,
  cart_data JSONB NOT NULL,
  total_price DECIMAL(10, 2),
  recovery_url TEXT,
  recovered_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_shop ON abandoned_carts(shop_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_customer ON abandoned_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_token ON abandoned_carts(token);

-- =============================================
-- SHOP SETTINGS & CONFIGURATION
-- =============================================

-- Shop Payment Methods
CREATE TABLE IF NOT EXISTS shop_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  is_enabled BOOLEAN DEFAULT true,
  is_test_mode BOOLEAN DEFAULT false,
  configuration JSONB,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_payment_methods_shop ON shop_payment_methods(shop_id);

-- Shop Notification Settings
CREATE TABLE IF NOT EXISTS shop_notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  email_recipients TEXT[],
  sms_enabled BOOLEAN DEFAULT false,
  sms_recipients TEXT[],
  webhook_enabled BOOLEAN DEFAULT false,
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_shop_notification_settings_shop ON shop_notification_settings(shop_id);

-- Shop Webhooks
CREATE TABLE IF NOT EXISTS shop_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  format VARCHAR(20) DEFAULT 'json',
  is_active BOOLEAN DEFAULT true,
  secret VARCHAR(100),
  api_version VARCHAR(20),
  failure_count INTEGER DEFAULT 0,
  last_failure_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_webhooks_shop ON shop_webhooks(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_webhooks_topic ON shop_webhooks(topic);

-- Shop API Keys
CREATE TABLE IF NOT EXISTS shop_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  access_scopes TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_api_keys_shop ON shop_api_keys(shop_id);

-- =============================================
-- SEED INITIAL DATA
-- =============================================

-- Create default shop plans
INSERT INTO shop_plans (name, description, price, billing_interval, features, limits, is_active, is_featured, trial_days, sort_order)
VALUES
  ('Basic', 'Perfect for getting started with e-commerce', 29.00, 'monthly', 
   '{"online_store": true, "unlimited_products": true, "staff_accounts": 2, "24_7_support": true}',
   '{"products": 1000, "file_storage": 1073741824, "bandwidth": 10737418240}',
   true, false, 14, 10),
  
  ('Professional', 'Everything you need for a growing business', 79.00, 'monthly', 
   '{"online_store": true, "unlimited_products": true, "staff_accounts": 5, "24_7_support": true, "professional_reports": true, "abandoned_cart_recovery": true}',
   '{"products": 10000, "file_storage": 5368709120, "bandwidth": 53687091200}',
   true, true, 14, 20),
  
  ('Enterprise', 'Advanced features for scaling businesses', 299.00, 'monthly', 
   '{"online_store": true, "unlimited_products": true, "staff_accounts": 15, "24_7_support": true, "professional_reports": true, "abandoned_cart_recovery": true, "custom_report_builder": true, "third_party_calculated_shipping_rates": true}',
   '{"products": null, "file_storage": 26843545600, "bandwidth": null}',
   true, false, 14, 30);

-- Create default product categories
INSERT INTO product_categories (id, shop_id, name, slug, description, is_featured, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Uncategorized', 'uncategorized', 'Default category for products', false, 999);

-- Create default customer groups
INSERT INTO customer_groups (id, shop_id, name, description, is_system_defined)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'All Customers', 'Default group for all customers', true),
  ('00000000-0000-0000-0000-000000000002', NULL, 'VIP Customers', 'Customers who have spent a significant amount', true),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Wholesale', 'Wholesale customers with special pricing', true);
