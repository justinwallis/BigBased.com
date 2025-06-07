import { createClient } from "@/lib/supabase/server"
import * as Sentry from "@sentry/nextjs"

export interface KnowledgeEntity {
  id: string
  entity_type: string
  entity_id?: string
  name: string
  description?: string
  properties: Record<string, any>
  confidence_score: number
  created_at: string
  updated_at: string
}

export interface KnowledgeRelationship {
  id: string
  source_entity_id: string
  target_entity_id: string
  relationship_type: string
  strength: number
  properties: Record<string, any>
  auto_generated: boolean
  verified: boolean
  created_at: string
  created_by?: string
}

export interface KnowledgeConcept {
  id: string
  name: string
  description?: string
  category?: string
  synonyms: string[]
  related_keywords: string[]
  importance_score: number
  created_at: string
  updated_at: string
}

export interface KnowledgeGraphNode {
  id: string
  name: string
  type: string
  properties: Record<string, any>
  connections: number
}

export interface KnowledgeGraphEdge {
  source: string
  target: string
  relationship: string
  strength: number
}

export class EnterpriseKnowledgeGraph {
  static async createEntity(
    entity: Omit<KnowledgeEntity, "id" | "created_at" | "updated_at">,
  ): Promise<KnowledgeEntity | null> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from("knowledge_entities").insert(entity).select().single()

      if (error) throw error
      return data
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error creating knowledge entity:", error)
      return null
    }
  }

  static async createRelationship(
    relationship: Omit<KnowledgeRelationship, "id" | "created_at">,
  ): Promise<KnowledgeRelationship | null> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from("knowledge_relationships").insert(relationship).select().single()

      if (error) throw error
      return data
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error creating knowledge relationship:", error)
      return null
    }
  }

  static async getEntityGraph(
    entityId: string,
    depth = 2,
  ): Promise<{ nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] }> {
    try {
      const supabase = createClient()

      // Get the entity and its relationships up to specified depth
      const { data: relationships, error } = await supabase
        .from("knowledge_relationships")
        .select(`
          *,
          source_entity:knowledge_entities!source_entity_id(*),
          target_entity:knowledge_entities!target_entity_id(*)
        `)
        .or(`source_entity_id.eq.${entityId},target_entity_id.eq.${entityId}`)

      if (error) throw error

      const nodes: KnowledgeGraphNode[] = []
      const edges: KnowledgeGraphEdge[] = []
      const nodeMap = new Map<string, KnowledgeGraphNode>()

      // Process relationships to build graph
      relationships?.forEach((rel: any) => {
        // Add source node
        if (!nodeMap.has(rel.source_entity.id)) {
          nodeMap.set(rel.source_entity.id, {
            id: rel.source_entity.id,
            name: rel.source_entity.name,
            type: rel.source_entity.entity_type,
            properties: rel.source_entity.properties,
            connections: 0,
          })
        }

        // Add target node
        if (!nodeMap.has(rel.target_entity.id)) {
          nodeMap.set(rel.target_entity.id, {
            id: rel.target_entity.id,
            name: rel.target_entity.name,
            type: rel.target_entity.entity_type,
            properties: rel.target_entity.properties,
            connections: 0,
          })
        }

        // Add edge
        edges.push({
          source: rel.source_entity.id,
          target: rel.target_entity.id,
          relationship: rel.relationship_type,
          strength: rel.strength,
        })

        // Update connection counts
        const sourceNode = nodeMap.get(rel.source_entity.id)!
        const targetNode = nodeMap.get(rel.target_entity.id)!
        sourceNode.connections++
        targetNode.connections++
      })

      return {
        nodes: Array.from(nodeMap.values()),
        edges,
      }
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error getting entity graph:", error)
      return { nodes: [], edges: [] }
    }
  }

  static async findSimilarEntities(entityId: string, limit = 10): Promise<KnowledgeEntity[]> {
    try {
      const supabase = createClient()

      // This is a simplified implementation
      // In production, you'd use vector similarity or more sophisticated algorithms
      const { data, error } = await supabase
        .from("knowledge_relationships")
        .select(`
          target_entity:knowledge_entities!target_entity_id(*)
        `)
        .eq("source_entity_id", entityId)
        .eq("relationship_type", "similar_to")
        .order("strength", { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map((item: any) => item.target_entity) || []
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error finding similar entities:", error)
      return []
    }
  }

  static async searchEntities(query: string, entityTypes?: string[]): Promise<KnowledgeEntity[]> {
    try {
      const supabase = createClient()

      let queryBuilder = supabase
        .from("knowledge_entities")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

      if (entityTypes && entityTypes.length > 0) {
        queryBuilder = queryBuilder.in("entity_type", entityTypes)
      }

      const { data, error } = await queryBuilder.order("confidence_score", { ascending: false }).limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error searching entities:", error)
      return []
    }
  }

  static async getConceptsByCategory(category?: string): Promise<KnowledgeConcept[]> {
    try {
      const supabase = createClient()

      let queryBuilder = supabase.from("knowledge_concepts").select("*")

      if (category) {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder.order("importance_score", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error getting concepts:", error)
      return []
    }
  }

  static async generateEntityFromContent(
    contentId: string,
    content: string,
    title: string,
  ): Promise<KnowledgeEntity | null> {
    try {
      // This would use AI to extract entities from content
      // For now, we'll create a basic entity
      const entity = await this.createEntity({
        entity_type: "content",
        entity_id: contentId,
        name: title,
        description: content.substring(0, 500) + "...",
        properties: {
          word_count: content.split(/\s+/).length,
          extracted_at: new Date().toISOString(),
        },
        confidence_score: 0.8,
      })

      return entity
    } catch (error) {
      Sentry.captureException(error)
      console.error("Error generating entity from content:", error)
      return null
    }
  }
}
