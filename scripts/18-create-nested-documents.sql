-- Create nested documents support
CREATE TABLE IF NOT EXISTS content_hierarchy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    child_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    depth INTEGER DEFAULT 0,
    path TEXT, -- Materialized path for efficient queries
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(parent_id, child_id),
    UNIQUE(parent_id, sort_order)
);

-- Add hierarchy support to content_items
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS path TEXT,
ADD COLUMN IF NOT EXISTS is_folder BOOLEAN DEFAULT FALSE;

-- Create indexes for efficient hierarchy queries
CREATE INDEX IF NOT EXISTS idx_content_hierarchy_parent ON content_hierarchy(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_hierarchy_child ON content_hierarchy(child_id);
CREATE INDEX IF NOT EXISTS idx_content_hierarchy_path ON content_hierarchy(path);
CREATE INDEX IF NOT EXISTS idx_content_items_parent ON content_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_items_path ON content_items(path);

-- Function to update materialized path
CREATE OR REPLACE FUNCTION update_content_path()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path = NEW.id::text;
        NEW.depth = 0;
    ELSE
        SELECT path || '.' || NEW.id::text, depth + 1
        INTO NEW.path, NEW.depth
        FROM content_items
        WHERE id = NEW.parent_id;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update paths
DROP TRIGGER IF EXISTS trigger_update_content_path ON content_items;
CREATE TRIGGER trigger_update_content_path
    BEFORE INSERT OR UPDATE OF parent_id ON content_items
    FOR EACH ROW
    EXECUTE FUNCTION update_content_path();

-- Function to get content tree
CREATE OR REPLACE FUNCTION get_content_tree(root_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    parent_id UUID,
    depth INTEGER,
    path TEXT,
    sort_order INTEGER,
    is_folder BOOLEAN,
    status TEXT,
    content_type_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE content_tree AS (
        -- Base case: root nodes
        SELECT 
            c.id,
            c.title,
            c.slug,
            c.parent_id,
            c.depth,
            c.path,
            c.sort_order,
            c.is_folder,
            c.status,
            ct.name as content_type_name
        FROM content_items c
        LEFT JOIN content_types ct ON c.content_type_id = ct.id
        WHERE (root_id IS NULL AND c.parent_id IS NULL) 
           OR (root_id IS NOT NULL AND c.id = root_id)
        
        UNION ALL
        
        -- Recursive case: children
        SELECT 
            c.id,
            c.title,
            c.slug,
            c.parent_id,
            c.depth,
            c.path,
            c.sort_order,
            c.is_folder,
            c.status,
            ct.name as content_type_name
        FROM content_items c
        LEFT JOIN content_types ct ON c.content_type_id = ct.id
        INNER JOIN content_tree ct_parent ON c.parent_id = ct_parent.id
    )
    SELECT * FROM content_tree
    ORDER BY path, sort_order;
END;
$$ LANGUAGE plpgsql;
