import { supabaseAdmin } from "./supabase/admin"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Types for our CMS content
export type Page = {
  id: string
  title: string
  slug: string
  content: any // Can be JSON or string depending on your editor
  meta_description?: string
  published: boolean
  created_at: string
  updated_at: string
  created_by: string
}

export type Post = {
  id: string
  title: string
  slug: string
  content: any
  excerpt?: string
  featured_image?: string
  meta_description?: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  created_by: string
  categories?: Category[]
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

export type Media = {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  alt_text?: string
  created_at: string
  created_by: string
}

// Function to get a page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabaseAdmin.from("pages").select("*").eq("slug", slug).eq("published", true).single()

  if (error || !data) {
    console.error("Error fetching page:", error)
    return null
  }

  return data as Page
}

// Function to get all published pages
export async function getPublishedPages(): Promise<Page[]> {
  const { data, error } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error || !data) {
    console.error("Error fetching pages:", error)
    return []
  }

  return data as Page[]
}

// Function to get a post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select(`
      *,
      categories:post_categories(
        category:categories(*)
      )
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !data) {
    console.error("Error fetching post:", error)
    return null
  }

  // Transform the categories data structure
  const post = data as any
  post.categories = post.categories?.map((item: any) => item.category) || []

  return post as Post
}

// Function to get all published posts
export async function getPublishedPosts(
  limit = 10,
  page = 1,
): Promise<{
  posts: Post[]
  count: number
}> {
  // Calculate offset
  const offset = (page - 1) * limit

  // Get count of all published posts
  const { count, error: countError } = await supabaseAdmin
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  if (countError) {
    console.error("Error counting posts:", countError)
    return { posts: [], count: 0 }
  }

  // Get posts with pagination
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select(`
      *,
      categories:post_categories(
        category:categories(*)
      )
    `)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error("Error fetching posts:", error)
    return { posts: [], count: 0 }
  }

  // Transform the categories data structure
  const posts = data.map((post: any) => {
    post.categories = post.categories?.map((item: any) => item.category) || []
    return post
  })

  return { posts: posts as Post[], count: count || 0 }
}

// Function to get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin.from("categories").select("*").order("name", { ascending: true })

  if (error || !data) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

// Function to get posts by category
export async function getPostsByCategory(
  categorySlug: string,
  limit = 10,
  page = 1,
): Promise<{
  posts: Post[]
  count: number
  category: Category | null
}> {
  // Get the category first
  const { data: categoryData, error: categoryError } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single()

  if (categoryError || !categoryData) {
    console.error("Error fetching category:", categoryError)
    return { posts: [], count: 0, category: null }
  }

  const category = categoryData as Category

  // Calculate offset
  const offset = (page - 1) * limit

  // Get count of posts in this category
  const { count, error: countError } = await supabaseAdmin
    .from("posts")
    .select("*, post_categories!inner(category_id)")
    .eq("published", true)
    .eq("post_categories.category_id", category.id)
    .count()

  if (countError) {
    console.error("Error counting posts by category:", countError)
    return { posts: [], count: 0, category }
  }

  // Get posts with pagination
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select(`
      *,
      categories:post_categories(
        category:categories(*)
      )
    `)
    .eq("published", true)
    .eq("post_categories.category_id", category.id)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error("Error fetching posts by category:", error)
    return { posts: [], count: 0, category }
  }

  // Transform the categories data structure
  const posts = data.map((post: any) => {
    post.categories = post.categories?.map((item: any) => item.category) || []
    return post
  })

  return { posts: posts as Post[], count: count || 0, category }
}

// Client-side functions for authenticated users

// Create a Supabase client with the user's session
export function createClientWithSession(supabaseUrl: string, supabaseKey: string, accessToken: string) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

// Function to create or update a page
export async function upsertPage(supabase: any, page: Partial<Page>) {
  const { data, error } = await supabase.from("pages").upsert(page).select().single()

  if (error) {
    console.error("Error upserting page:", error)
    throw error
  }

  return data
}

// Function to create or update a post
export async function upsertPost(supabase: any, post: Partial<Post>, categoryIds: string[] = []) {
  // First upsert the post
  const { data, error } = await supabase.from("posts").upsert(post).select().single()

  if (error) {
    console.error("Error upserting post:", error)
    throw error
  }

  // If we have categories, update the post_categories junction table
  if (categoryIds.length > 0) {
    // First delete existing categories for this post
    await supabase.from("post_categories").delete().eq("post_id", data.id)

    // Then insert the new categories
    const categoryRelations = categoryIds.map((categoryId) => ({
      post_id: data.id,
      category_id: categoryId,
    }))

    const { error: categoriesError } = await supabase.from("post_categories").insert(categoryRelations)

    if (categoriesError) {
      console.error("Error updating post categories:", categoriesError)
      throw categoriesError
    }
  }

  return data
}

// Function to delete a page
export async function deletePage(supabase: any, id: string) {
  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting page:", error)
    throw error
  }

  return true
}

// Function to delete a post
export async function deletePost(supabase: any, id: string) {
  // Delete the post (post_categories will be deleted via cascade)
  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting post:", error)
    throw error
  }

  return true
}

// Function to upload media
export async function uploadMedia(supabase: any, file: File, path: string) {
  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    throw error
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(data.path)

  // Create a record in the media table
  const mediaRecord = {
    filename: data.path,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    url: publicUrlData.publicUrl,
    alt_text: file.name,
  }

  const { data: mediaData, error: mediaError } = await supabase.from("media").insert(mediaRecord).select().single()

  if (mediaError) {
    console.error("Error creating media record:", mediaError)
    throw mediaError
  }

  return mediaData
}

// Function to get all media
export async function getMedia(limit = 20, page = 1) {
  const offset = (page - 1) * limit

  const { count, error: countError } = await supabaseAdmin.from("media").select("*", { count: "exact", head: true })

  if (countError) {
    console.error("Error counting media:", countError)
    return { media: [], count: 0 }
  }

  const { data, error } = await supabaseAdmin
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !data) {
    console.error("Error fetching media:", error)
    return { media: [], count: 0 }
  }

  return { media: data as Media[], count: count || 0 }
}
