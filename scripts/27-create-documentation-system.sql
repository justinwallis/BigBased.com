-- Documentation System Tables
CREATE TABLE IF NOT EXISTS documentation_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER REFERENCES documentation_categories(id),
  icon VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentation_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id INTEGER REFERENCES documentation_categories(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'published',
  version VARCHAR(50) DEFAULT '1.0',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, category_id)
);

CREATE TABLE IF NOT EXISTS documentation_article_versions (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES documentation_articles(id) NOT NULL,
  content TEXT NOT NULL,
  version VARCHAR(50) NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentation_feedback (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES documentation_articles(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentation_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentation_article_tags (
  article_id INTEGER REFERENCES documentation_articles(id) NOT NULL,
  tag_id INTEGER REFERENCES documentation_tags(id) NOT NULL,
  PRIMARY KEY (article_id, tag_id)
);

-- Community Forum Tables
CREATE TABLE IF NOT EXISTS community_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(50),
  icon VARCHAR(255),
  parent_id INTEGER REFERENCES community_categories(id),
  is_visible BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES community_categories(id) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, category_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES community_topics(id) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  is_solution BOOLEAN DEFAULT false,
  parent_id INTEGER REFERENCES community_posts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_reactions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES community_posts(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS community_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_topic_tags (
  topic_id INTEGER REFERENCES community_topics(id) NOT NULL,
  tag_id INTEGER REFERENCES community_tags(id) NOT NULL,
  PRIMARY KEY (topic_id, tag_id)
);

CREATE TABLE IF NOT EXISTS community_user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  badge_description TEXT,
  badge_icon VARCHAR(255),
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  reference_id INTEGER,
  reference_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search and Integration Tables
CREATE TABLE IF NOT EXISTS unified_search_index (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doc_articles_category ON documentation_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_doc_articles_slug ON documentation_articles(slug);
CREATE INDEX IF NOT EXISTS idx_community_topics_category ON community_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_topic ON community_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_unified_search_content_type ON unified_search_index(content_type);

-- Create functions for search
CREATE OR REPLACE FUNCTION update_unified_search_index_doc() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO unified_search_index (content_id, content_type, title, content, metadata)
    VALUES (NEW.id, 'documentation', NEW.title, NEW.content, json_build_object('category_id', NEW.category_id));
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE unified_search_index
    SET title = NEW.title, content = NEW.content, 
        metadata = json_build_object('category_id', NEW.category_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_id = NEW.id AND content_type = 'documentation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_unified_search_index_topic() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO unified_search_index (content_id, content_type, title, content, metadata)
    VALUES (NEW.id, 'community_topic', NEW.title, NEW.content, json_build_object('category_id', NEW.category_id));
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE unified_search_index
    SET title = NEW.title, content = NEW.content, 
        metadata = json_build_object('category_id', NEW.category_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE content_id = NEW.id AND content_type = 'community_topic';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for search index updates
CREATE TRIGGER update_search_index_doc
AFTER INSERT OR UPDATE ON documentation_articles
FOR EACH ROW EXECUTE FUNCTION update_unified_search_index_doc();

CREATE TRIGGER update_search_index_topic
AFTER INSERT OR UPDATE ON community_topics
FOR EACH ROW EXECUTE FUNCTION update_unified_search_index_topic();

-- Seed initial documentation categories
INSERT INTO documentation_categories (name, slug, description, icon, order_index)
VALUES 
('Getting Started', 'getting-started', 'Learn the basics of Big Based platform', 'book-open', 1),
('User Guides', 'user-guides', 'Detailed guides for using Big Based features', 'users', 2),
('API Reference', 'api-reference', 'Complete API documentation for developers', 'code', 3),
('Tutorials', 'tutorials', 'Step-by-step tutorials for common tasks', 'graduation-cap', 4),
('FAQs', 'faqs', 'Frequently asked questions', 'help-circle', 5);

-- Seed initial community categories
INSERT INTO community_categories (name, slug, description, color, icon, order_index)
VALUES 
('Announcements', 'announcements', 'Official announcements from the Big Based team', '#3b82f6', 'megaphone', 1),
('General Discussion', 'general-discussion', 'General discussion about Big Based', '#10b981', 'message-circle', 2),
('Feature Requests', 'feature-requests', 'Suggest new features for Big Based', '#f59e0b', 'lightbulb', 3),
('Help & Support', 'help-support', 'Get help with using Big Based', '#ef4444', 'life-buoy', 4),
('Showcase', 'showcase', 'Share what you\'ve built with Big Based', '#8b5cf6', 'layout', 5);
