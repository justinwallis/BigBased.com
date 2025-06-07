-- Create documentation system tables
CREATE TABLE IF NOT EXISTS documentation_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES documentation_categories(id) ON DELETE CASCADE,
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documentation_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category_id INTEGER NOT NULL REFERENCES documentation_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version VARCHAR(20) DEFAULT '1.0',
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS documentation_article_versions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES documentation_articles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    author_id UUID NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documentation_feedback (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES documentation_articles(id) ON DELETE CASCADE,
    user_id UUID,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community system tables
CREATE TABLE IF NOT EXISTS community_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50),
    parent_id INTEGER REFERENCES community_categories(id) ON DELETE CASCADE,
    is_visible BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES community_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending', 'archived')),
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES community_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    parent_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_reactions (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'heart', 'laugh', 'confused', 'hooray')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS community_user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unified search index for both documentation and community
CREATE TABLE IF NOT EXISTS unified_search_index (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('documentation', 'community_topic', 'community_post')),
    content_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_slug VARCHAR(255),
    author_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documentation_articles_category ON documentation_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_documentation_articles_status ON documentation_articles(status);
CREATE INDEX IF NOT EXISTS idx_documentation_articles_featured ON documentation_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_documentation_articles_slug ON documentation_articles(slug);

CREATE INDEX IF NOT EXISTS idx_community_topics_category ON community_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_community_topics_status ON community_topics(status);
CREATE INDEX IF NOT EXISTS idx_community_topics_pinned ON community_topics(is_pinned);
CREATE INDEX IF NOT EXISTS idx_community_topics_last_post ON community_topics(last_post_at);

CREATE INDEX IF NOT EXISTS idx_community_posts_topic ON community_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_parent ON community_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_solution ON community_posts(is_solution);

CREATE INDEX IF NOT EXISTS idx_unified_search_content_type ON unified_search_index(content_type);
CREATE INDEX IF NOT EXISTS idx_unified_search_title ON unified_search_index USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_unified_search_content ON unified_search_index USING gin(to_tsvector('english', content));

-- Insert default documentation categories
INSERT INTO documentation_categories (name, slug, description, icon, order_index) VALUES
('Getting Started', 'getting-started', 'Learn the basics of using Big Based platform', 'book-open', 1),
('User Management', 'user-management', 'Managing users, profiles, and authentication', 'user', 2),
('Admin Panel', 'admin-panel', 'Complete guide to the administrative interface', 'settings', 3),
('Profile Management', 'profile-management', 'User profile features and customization', 'user-circle', 4),
('Shop System', 'shop-system', 'E-commerce and shop management features', 'shopping-cart', 5),
('CMS Features', 'cms-features', 'Content management system capabilities', 'file-text', 6),
('API Documentation', 'api-documentation', 'Developer API reference and guides', 'code', 7),
('Security', 'security', 'Security features and best practices', 'shield', 8),
('Billing & Subscriptions', 'billing-subscriptions', 'Payment processing and subscription management', 'credit-card', 9),
('Troubleshooting', 'troubleshooting', 'Common issues and solutions', 'help-circle', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert default community categories
INSERT INTO community_categories (name, slug, description, color, icon, order_index) VALUES
('General Discussion', 'general', 'General discussions about Big Based platform', '#3B82F6', 'message-circle', 1),
('Feature Requests', 'feature-requests', 'Suggest new features and improvements', '#10B981', 'lightbulb', 2),
('Technical Support', 'support', 'Get help with technical issues', '#EF4444', 'help-circle', 3),
('Announcements', 'announcements', 'Official platform announcements', '#8B5CF6', 'megaphone', 4),
('Showcase', 'showcase', 'Show off your Big Based projects', '#F59E0B', 'star', 5),
('Development', 'development', 'Developer discussions and API help', '#6B7280', 'code', 6)
ON CONFLICT (slug) DO NOTHING;

-- Create triggers to update search index
CREATE OR REPLACE FUNCTION update_search_index_docs()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO unified_search_index (content_type, content_id, title, content, category_slug, author_id, updated_at)
        SELECT 
            'documentation',
            NEW.id,
            NEW.title,
            NEW.content,
            dc.slug,
            NEW.author_id,
            NOW()
        FROM documentation_categories dc
        WHERE dc.id = NEW.category_id
        ON CONFLICT (content_type, content_id) 
        DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            category_slug = EXCLUDED.category_slug,
            updated_at = EXCLUDED.updated_at;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM unified_search_index 
        WHERE content_type = 'documentation' AND content_id = OLD.id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_search_index_community()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO unified_search_index (content_type, content_id, title, content, category_slug, author_id, updated_at)
        SELECT 
            'community_topic',
            NEW.id,
            NEW.title,
            NEW.content,
            cc.slug,
            NEW.author_id,
            NOW()
        FROM community_categories cc
        WHERE cc.id = NEW.category_id
        ON CONFLICT (content_type, content_id) 
        DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            category_slug = EXCLUDED.category_slug,
            updated_at = EXCLUDED.updated_at;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM unified_search_index 
        WHERE content_type = 'community_topic' AND content_id = OLD.id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_search_index_docs ON documentation_articles;
CREATE TRIGGER trigger_update_search_index_docs
    AFTER INSERT OR UPDATE OR DELETE ON documentation_articles
    FOR EACH ROW EXECUTE FUNCTION update_search_index_docs();

DROP TRIGGER IF EXISTS trigger_update_search_index_community ON community_topics;
CREATE TRIGGER trigger_update_search_index_community
    AFTER INSERT OR UPDATE OR DELETE ON community_topics
    FOR EACH ROW EXECUTE FUNCTION update_search_index_community();
