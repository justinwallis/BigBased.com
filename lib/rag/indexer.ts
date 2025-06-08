import { createClient } from "@/lib/supabase/server"
import { chromaManager } from "./chroma-client"
import { generateEmbeddings } from "./huggingface-embeddings"
import { googleDriveManager } from "./google-drive-client"
import { chunkText, chunkDocumentation, chunkForumPost } from "./chunker"
import type { ContentChunk, ContentType } from "./config"

export class ContentIndexer {
  private supabase = createClient()

  async indexAllContent(tenantId: string) {
    console.log(`Starting full content indexing for tenant: ${tenantId}`)

    await Promise.all([
      this.indexDocumentation(tenantId),
      this.indexCMSContent(tenantId),
      this.indexForumPosts(tenantId),
      this.indexProducts(tenantId),
      this.indexGoogleDrive(tenantId),
    ])

    console.log(`Completed full content indexing for tenant: ${tenantId}`)
  }

  async indexGoogleDrive(tenantId: string) {
    try {
      console.log("Starting Google Drive sync...")
      const files = await googleDriveManager.syncFolder(tenantId)

      for (const file of files) {
        await this.indexSingleContent({
          sourceId: `drive_${file.id}`,
          contentType: "google_drive",
          tenantId,
          title: file.name,
          content: file.content,
          url: file.url,
          tags: ["google-drive"],
          createdAt: file.modifiedTime,
          updatedAt: file.modifiedTime,
          driveFileId: file.id,
        })
      }

      console.log(`Indexed ${files.length} Google Drive files`)
    } catch (error) {
      console.error("Error indexing Google Drive:", error)
    }
  }

  async indexDocumentation(tenantId: string) {
    const { data: articles, error } = await this.supabase
      .from("documentation_articles")
      .select(`
        id,
        title,
        content,
        slug,
        excerpt,
        tags,
        created_at,
        updated_at,
        categories(name, slug)
      `)
      .eq("status", "published")

    if (error) {
      console.error("Error fetching documentation:", error)
      return
    }

    for (const article of articles || []) {
      await this.indexSingleContent({
        sourceId: `doc_${article.id}`,
        contentType: "documentation",
        tenantId,
        title: article.title,
        content: article.content,
        url: `/docs/${article.categories?.slug}/${article.slug}`,
        tags: article.tags || [],
        createdAt: article.created_at,
        updatedAt: article.updated_at,
      })
    }
  }

  async indexCMSContent(tenantId: string) {
    const { data: content, error } = await this.supabase
      .from("content_items")
      .select(`
        id,
        title,
        content,
        slug,
        seo_keywords,
        created_at,
        updated_at,
        content_types(name, slug)
      `)
      .eq("status", "published")

    if (error) {
      console.error("Error fetching CMS content:", error)
      return
    }

    for (const item of content || []) {
      await this.indexSingleContent({
        sourceId: `cms_${item.id}`,
        contentType: "cms_content",
        tenantId,
        title: item.title,
        content: typeof item.content === "string" ? item.content : JSON.stringify(item.content),
        url: `/content/${item.slug}`,
        tags: item.seo_keywords || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })
    }
  }

  async indexForumPosts(tenantId: string) {
    // Assuming you have forum tables - adjust based on your schema
    const { data: posts, error } = await this.supabase
      .from("forum_posts")
      .select(`
        id,
        title,
        content,
        created_at,
        updated_at,
        author_id,
        category_id
      `)
      .eq("status", "published")

    if (error) {
      console.error("Error fetching forum posts:", error)
      return
    }

    for (const post of posts || []) {
      await this.indexSingleContent({
        sourceId: `forum_${post.id}`,
        contentType: "forum_post",
        tenantId,
        title: post.title,
        content: post.content,
        url: `/community/posts/${post.id}`,
        tags: [],
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: post.author_id,
      })
    }
  }

  async indexProducts(tenantId: string) {
    // Assuming you have shop products - adjust based on your schema
    const { data: products, error } = await this.supabase
      .from("shop_products")
      .select(`
        id,
        name,
        description,
        created_at,
        updated_at,
        shop_id
      `)
      .eq("status", "active")

    if (error) {
      console.error("Error fetching products:", error)
      return
    }

    for (const product of products || []) {
      await this.indexSingleContent({
        sourceId: `product_${product.id}`,
        contentType: "product",
        tenantId,
        title: product.name,
        content: product.description || "",
        url: `/shop/${product.shop_id}/products/${product.id}`,
        tags: [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      })
    }
  }

  async indexSingleContent({
    sourceId,
    contentType,
    tenantId,
    title,
    content,
    url,
    tags = [],
    createdAt,
    updatedAt,
    author,
    driveFileId,
  }: {
    sourceId: string
    contentType: ContentType
    tenantId: string
    title: string
    content: string
    url: string
    tags?: string[]
    createdAt: string
    updatedAt: string
    author?: string
    driveFileId?: string
  }) {
    try {
      // Delete existing chunks for this content
      await chromaManager.deleteBySourceId(sourceId, tenantId)

      // Create chunks based on content type
      let chunks: Omit<ContentChunk, "embedding">[]

      const baseMetadata = {
        content_type: contentType,
        tenant_id: tenantId,
        source_id: sourceId,
        title,
        url,
        author,
        tags,
        created_at: createdAt,
        updated_at: updatedAt,
        drive_file_id: driveFileId,
      }

      switch (contentType) {
        case "documentation":
          chunks = chunkDocumentation(content, baseMetadata)
          break
        case "forum_post":
          chunks = chunkForumPost(content, baseMetadata)
          break
        default:
          chunks = chunkText(content, baseMetadata)
      }

      if (chunks.length === 0) return

      // Generate embeddings
      const texts = chunks.map((chunk) => `${chunk.metadata.title}\n\n${chunk.content}`)
      const embeddings = await generateEmbeddings(texts)

      // Add embeddings to chunks
      const chunksWithEmbeddings: ContentChunk[] = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: embeddings[index],
      }))

      // Store in vector database
      await chromaManager.upsertChunks(chunksWithEmbeddings)

      console.log(`Indexed ${chunks.length} chunks for ${sourceId}`)
    } catch (error) {
      console.error(`Error indexing content ${sourceId}:`, error)
    }
  }

  async deleteContent(sourceId: string, tenantId: string) {
    await chromaManager.deleteBySourceId(sourceId, tenantId)
  }
}

export const contentIndexer = new ContentIndexer()
