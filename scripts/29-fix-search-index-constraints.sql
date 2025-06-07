-- Fix the unified_search_index table constraints and triggers

-- First, let's add the missing unique constraint
ALTER TABLE unified_search_index 
ADD CONSTRAINT unified_search_index_unique_content 
UNIQUE (content_type, content_id);

-- Update the trigger functions to handle the constraint properly
CREATE OR REPLACE FUNCTION update_search_index_docs()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Delete existing entry first to avoid conflicts
        DELETE FROM unified_search_index 
        WHERE content_type = 'documentation' AND content_id = NEW.id;
        
        -- Insert new entry
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
        WHERE dc.id = NEW.category_id;
        
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
        -- Delete existing entry first to avoid conflicts
        DELETE FROM unified_search_index 
        WHERE content_type = 'community_topic' AND content_id = NEW.id;
        
        -- Insert new entry
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
        WHERE cc.id = NEW.category_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM unified_search_index 
        WHERE content_type = 'community_topic' AND content_id = OLD.id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the triggers
DROP TRIGGER IF EXISTS trigger_update_search_index_docs ON documentation_articles;
CREATE TRIGGER trigger_update_search_index_docs
    AFTER INSERT OR UPDATE OR DELETE ON documentation_articles
    FOR EACH ROW EXECUTE FUNCTION update_search_index_docs();

DROP TRIGGER IF EXISTS trigger_update_search_index_community ON community_topics;
CREATE TRIGGER trigger_update_search_index_community
    AFTER INSERT OR UPDATE OR DELETE ON community_topics
    FOR EACH ROW EXECUTE FUNCTION update_search_index_community();
