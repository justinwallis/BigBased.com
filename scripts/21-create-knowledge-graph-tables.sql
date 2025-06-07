-- Enterprise Knowledge Graph

-- Knowledge Entities Table (represents any entity in the system)
CREATE TABLE IF NOT EXISTS knowledge_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL, -- content, product, user, concept, tag, etc.
  entity_id UUID, -- reference to the actual entity (content_items.id, etc.)
  name VARCHAR(255) NOT NULL,
  description TEXT,
  properties JSONB DEFAULT '{}', -- flexible properties for different entity types
  confidence_score DECIMAL(3,2) DEFAULT 1.0, -- AI confidence in entity extraction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Relationships Table
CREATE TABLE IF NOT EXISTS knowledge_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  target_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  relationship_type VARCHAR(100) NOT NULL, -- related_to, part_of, mentions, similar_to, etc.
  strength DECIMAL(3,2) DEFAULT 1.0, -- relationship strength (0.0 to 1.0)
  properties JSONB DEFAULT '{}', -- additional relationship metadata
  auto_generated BOOLEAN DEFAULT false, -- whether this was AI-generated
  verified BOOLEAN DEFAULT false, -- whether this has been human-verified
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Knowledge Concepts Table (for abstract concepts and topics)
CREATE TABLE IF NOT EXISTS knowledge_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100), -- topic, industry, technology, etc.
  synonyms TEXT[], -- alternative names
  related_keywords TEXT[], -- associated keywords
  importance_score DECIMAL(3,2) DEFAULT 0.5, -- how important this concept is
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entity-Concept Associations
CREATE TABLE IF NOT EXISTS entity_concept_associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES knowledge_entities(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  relevance_score DECIMAL(3,2) DEFAULT 1.0, -- how relevant the concept is to the entity
  auto_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Graph Analytics
CREATE TABLE IF NOT EXISTS knowledge_graph_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  entity_id UUID REFERENCES knowledge_entities(id),
  concept_id UUID REFERENCES knowledge_concepts(id),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_entities_type ON knowledge_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_entities_entity_id ON knowledge_entities(entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_source ON knowledge_relationships(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_target ON knowledge_relationships(target_entity_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relationships_type ON knowledge_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_concepts_category ON knowledge_concepts(category);
CREATE INDEX IF NOT EXISTS idx_entity_concept_associations_entity ON entity_concept_associations(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_concept_associations_concept ON entity_concept_associations(concept_id);
