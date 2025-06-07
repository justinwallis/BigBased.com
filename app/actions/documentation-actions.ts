"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { generateSlug } from "@/lib/utils"

// Types
export interface DocumentationCategory {
  id: number
  name: string
  slug: string
  description: string | null
  parent_id: number | null
  icon: string | null
  order_index: number
  is_visible: boolean
}

export interface DocumentationArticle {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  category_id: number
  author_id: string
  status: string
  version: string
  is_featured: boolean
  view_count: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  category?: DocumentationCategory
  author?: {
    name: string
    email: string
    image: string
  }
}

// Get all documentation categories
export async function getDocumentationCategories(): Promise<DocumentationCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentation_categories")
    .select("*")
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching documentation categories:", error)
    return []
  }

  return data || []
}

// Get a single documentation category by slug
export async function getDocumentationCategoryBySlug(slug: string): Promise<DocumentationCategory | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("documentation_categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching documentation category:", error)
    return null
  }

  return data
}

// Get all articles for a category
export async function getArticlesByCategory(categoryId: number): Promise<DocumentationArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentation_articles")
    .select(`
      *,
      category:documentation_categories(*)
    `)
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("title", { ascending: true })

  if (error) {
    console.error("Error fetching articles by category:", error)
    return []
  }

  return data || []
}

// Get a single article by slug and category
export async function getArticleBySlug(slug: string, categorySlug: string): Promise<DocumentationArticle | null> {
  const supabase = createClient()

  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from("documentation_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError)
    return null
  }

  // Then get the article
  const { data, error } = await supabase
    .from("documentation_articles")
    .select(`
      *,
      category:documentation_categories(*),
      author:author_id(name, email, image)
    `)
    .eq("slug", slug)
    .eq("category_id", category.id)
    .single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }

  // Increment view count
  await supabase
    .from("documentation_articles")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", data.id)

  return data
}

// Create a new article
export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to create an article")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = Number.parseInt(formData.get("category_id") as string)
  const excerpt = (formData.get("excerpt") as string) || null

  if (!title || !content || !categoryId) {
    throw new Error("Missing required fields")
  }

  const slug = generateSlug(title)

  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentation_articles")
    .insert({
      title,
      slug,
      content,
      excerpt,
      category_id: categoryId,
      author_id: session.user.id,
      status: "published",
      version: "1.0",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating article:", error)
    throw new Error("Failed to create article")
  }

  revalidatePath("/docs")
  redirect(`/docs/${data.category.slug}/${data.slug}`)
}

// Update an existing article
export async function updateArticle(articleId: number, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to update an article")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = Number.parseInt(formData.get("category_id") as string)
  const excerpt = (formData.get("excerpt") as string) || null
  const version = formData.get("version") as string

  if (!title || !content || !categoryId) {
    throw new Error("Missing required fields")
  }

  const supabase = createClient()

  // Get the current article to store as a version
  const { data: currentArticle, error: fetchError } = await supabase
    .from("documentation_articles")
    .select("*")
    .eq("id", articleId)
    .single()

  if (fetchError) {
    console.error("Error fetching current article:", fetchError)
    throw new Error("Failed to update article")
  }

  // Store the current version
  const { error: versionError } = await supabase.from("documentation_article_versions").insert({
    article_id: articleId,
    content: currentArticle.content,
    version: currentArticle.version,
    author_id: currentArticle.author_id,
    change_summary: `Version ${currentArticle.version}`,
  })

  if (versionError) {
    console.error("Error storing article version:", versionError)
  }

  // Update the article
  const { data, error } = await supabase
    .from("documentation_articles")
    .update({
      title,
      content,
      excerpt,
      category_id: categoryId,
      version,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId)
    .select(`
      *,
      category:documentation_categories(*)
    `)
    .single()

  if (error) {
    console.error("Error updating article:", error)
    throw new Error("Failed to update article")
  }

  revalidatePath(`/docs/${data.category.slug}/${data.slug}`)
  revalidatePath("/docs")

  return data
}

// Submit feedback for an article
export async function submitArticleFeedback(articleId: number, rating: number, comment: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const supabase = createClient()

  const { error } = await supabase.from("documentation_feedback").insert({
    article_id: articleId,
    user_id: userId,
    rating,
    comment,
  })

  if (error) {
    console.error("Error submitting feedback:", error)
    throw new Error("Failed to submit feedback")
  }

  return { success: true }
}

// Search documentation
export async function searchDocumentation(query: string): Promise<DocumentationArticle[]> {
  if (!query || query.length < 3) {
    return []
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from("unified_search_index")
    .select("*")
    .eq("content_type", "documentation")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error("Error searching documentation:", error)
    return []
  }

  // Fetch the actual articles
  if (data.length > 0) {
    const articleIds = data.map((item) => item.content_id)

    const { data: articles, error: articlesError } = await supabase
      .from("documentation_articles")
      .select(`
        *,
        category:documentation_categories(*)
      `)
      .in("id", articleIds)
      .eq("status", "published")

    if (articlesError) {
      console.error("Error fetching search results:", articlesError)
      return []
    }

    return articles || []
  }

  return []
}

// Get featured articles
export async function getFeaturedArticles(): Promise<DocumentationArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentation_articles")
    .select(`
      *,
      category:documentation_categories(*)
    `)
    .eq("is_featured", true)
    .eq("status", "published")
    .limit(6)

  if (error) {
    console.error("Error fetching featured articles:", error)
    return []
  }

  return data || []
}

// Get popular articles
export async function getPopularArticles(): Promise<DocumentationArticle[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentation_articles")
    .select(`
      *,
      category:documentation_categories(*)
    `)
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching popular articles:", error)
    return []
  }

  return data || []
}
