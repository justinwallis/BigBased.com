"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { generateSlug } from "@/lib/utils"

// Types
export interface CommunityCategory {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  parent_id: number | null
  is_visible: boolean
  requires_approval: boolean
  order_index: number
}

export interface CommunityTopic {
  id: number
  title: string
  slug: string
  content: string
  category_id: number
  author_id: string
  status: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  last_post_at: string
  created_at: string
  updated_at: string
  category?: CommunityCategory
  author?: {
    name: string
    email: string
    image: string
  }
  post_count?: number
}

export interface CommunityPost {
  id: number
  topic_id: number
  content: string
  author_id: string
  is_solution: boolean
  parent_id: number | null
  created_at: string
  updated_at: string
  author?: {
    name: string
    email: string
    image: string
  }
  reactions?: {
    reaction_type: string
    count: number
    user_reacted: boolean
  }[]
}

// Get all community categories
export async function getCommunityCategories(): Promise<CommunityCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_categories")
    .select("*")
    .eq("is_visible", true)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching community categories:", error)
    return []
  }

  return data || []
}

// Get a single community category by slug
export async function getCommunityCategoryBySlug(slug: string): Promise<CommunityCategory | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single()

  if (error) {
    console.error("Error fetching community category:", error)
    return null
  }

  return data
}

// Get topics for a category
export async function getTopicsByCategory(
  categoryId: number,
  page = 1,
  limit = 20,
): Promise<{ topics: CommunityTopic[]; total: number }> {
  const supabase = createClient()
  const offset = (page - 1) * limit

  // Get total count
  const { count, error: countError } = await supabase
    .from("community_topics")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId)

  if (countError) {
    console.error("Error counting topics:", countError)
    return { topics: [], total: 0 }
  }

  // Get topics with pagination
  const { data, error } = await supabase
    .from("community_topics")
    .select(`
      *,
      category:community_categories(*),
      author:author_id(name, email, image),
      post_count:community_posts(count)
    `)
    .eq("category_id", categoryId)
    .order("is_pinned", { ascending: false })
    .order("last_post_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching topics by category:", error)
    return { topics: [], total: 0 }
  }

  return { topics: data || [], total: count || 0 }
}

// Get a single topic by slug
export async function getTopicBySlug(slug: string, categorySlug: string): Promise<CommunityTopic | null> {
  const supabase = createClient()

  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from("community_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single()

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError)
    return null
  }

  // Then get the topic
  const { data, error } = await supabase
    .from("community_topics")
    .select(`
      *,
      category:community_categories(*),
      author:author_id(name, email, image)
    `)
    .eq("slug", slug)
    .eq("category_id", category.id)
    .single()

  if (error) {
    console.error("Error fetching topic:", error)
    return null
  }

  // Increment view count
  await supabase
    .from("community_topics")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", data.id)

  return data
}

// Get posts for a topic
export async function getPostsByTopic(
  topicId: number,
  page = 1,
  limit = 20,
): Promise<{ posts: CommunityPost[]; total: number }> {
  const supabase = createClient()
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const offset = (page - 1) * limit

  // Get total count
  const { count, error: countError } = await supabase
    .from("community_posts")
    .select("*", { count: "exact", head: true })
    .eq("topic_id", topicId)
    .is("parent_id", null) // Only count top-level posts

  if (countError) {
    console.error("Error counting posts:", countError)
    return { posts: [], total: 0 }
  }

  // Get posts with pagination
  const { data, error } = await supabase
    .from("community_posts")
    .select(`
      *,
      author:author_id(name, email, image)
    `)
    .eq("topic_id", topicId)
    .is("parent_id", null) // Only get top-level posts
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching posts by topic:", error)
    return { posts: [], total: 0 }
  }

  // Get reactions for each post
  const posts = await Promise.all(
    data.map(async (post) => {
      const { data: reactions, error: reactionsError } = await supabase
        .from("community_reactions")
        .select("reaction_type, user_id")
        .eq("post_id", post.id)

      if (reactionsError) {
        console.error("Error fetching reactions:", reactionsError)
        return post
      }

      // Group reactions by type and count them
      const reactionCounts = reactions.reduce(
        (acc, reaction) => {
          if (!acc[reaction.reaction_type]) {
            acc[reaction.reaction_type] = {
              count: 0,
              user_reacted: false,
            }
          }

          acc[reaction.reaction_type].count++

          if (reaction.user_id === userId) {
            acc[reaction.reaction_type].user_reacted = true
          }

          return acc
        },
        {} as Record<string, { count: number; user_reacted: boolean }>,
      )

      // Convert to array format
      const formattedReactions = Object.entries(reactionCounts).map(([type, data]) => ({
        reaction_type: type,
        count: data.count,
        user_reacted: data.user_reacted,
      }))

      return {
        ...post,
        reactions: formattedReactions,
      }
    }),
  )

  return { posts, total: count || 0 }
}

// Create a new topic
export async function createTopic(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to create a topic")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = Number.parseInt(formData.get("category_id") as string)

  if (!title || !content || !categoryId) {
    throw new Error("Missing required fields")
  }

  const slug = generateSlug(title)

  const supabase = createClient()

  // Check if category requires approval
  const { data: category, error: categoryError } = await supabase
    .from("community_categories")
    .select("requires_approval")
    .eq("id", categoryId)
    .single()

  if (categoryError) {
    console.error("Error checking category:", categoryError)
    throw new Error("Failed to create topic")
  }

  const status = category.requires_approval ? "pending" : "open"

  // Create the topic
  const { data: topic, error: topicError } = await supabase
    .from("community_topics")
    .insert({
      title,
      slug,
      content,
      category_id: categoryId,
      author_id: session.user.id,
      status,
    })
    .select(`
      *,
      category:community_categories(*)
    `)
    .single()

  if (topicError) {
    console.error("Error creating topic:", topicError)
    throw new Error("Failed to create topic")
  }

  // Create the first post
  const { error: postError } = await supabase.from("community_posts").insert({
    topic_id: topic.id,
    content,
    author_id: session.user.id,
  })

  if (postError) {
    console.error("Error creating post:", postError)
    // Don't throw here, the topic was created successfully
  }

  revalidatePath("/community")
  redirect(`/community/${topic.category.slug}/${topic.slug}`)
}

// Create a reply to a topic
export async function createReply(topicId: number, formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to reply")
  }

  const content = formData.get("content") as string
  const parentId = formData.get("parent_id") ? Number.parseInt(formData.get("parent_id") as string) : null

  if (!content) {
    throw new Error("Content is required")
  }

  const supabase = createClient()

  // Check if topic is locked
  const { data: topic, error: topicError } = await supabase
    .from("community_topics")
    .select("is_locked, category:community_categories(slug)")
    .eq("id", topicId)
    .single()

  if (topicError) {
    console.error("Error checking topic:", topicError)
    throw new Error("Failed to create reply")
  }

  if (topic.is_locked) {
    throw new Error("This topic is locked")
  }

  // Create the post
  const { error: postError } = await supabase.from("community_posts").insert({
    topic_id: topicId,
    content,
    author_id: session.user.id,
    parent_id: parentId,
  })

  if (postError) {
    console.error("Error creating reply:", postError)
    throw new Error("Failed to create reply")
  }

  // Update the topic's last_post_at
  const { error: updateError } = await supabase
    .from("community_topics")
    .update({
      last_post_at: new Date().toISOString(),
    })
    .eq("id", topicId)

  if (updateError) {
    console.error("Error updating topic:", updateError)
    // Don't throw here, the post was created successfully
  }

  // Get the topic slug for redirection
  const { data: fullTopic, error: slugError } = await supabase
    .from("community_topics")
    .select("slug, category:community_categories(slug)")
    .eq("id", topicId)
    .single()

  if (slugError) {
    console.error("Error getting topic slug:", slugError)
    throw new Error("Failed to redirect")
  }

  revalidatePath(`/community/${fullTopic.category.slug}/${fullTopic.slug}`)
  return { success: true }
}

// Add a reaction to a post
export async function addReaction(postId: number, reactionType: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to react")
  }

  const supabase = createClient()

  // Check if user already reacted with this type
  const { data: existingReaction, error: checkError } = await supabase
    .from("community_reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", session.user.id)
    .eq("reaction_type", reactionType)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error checking reaction:", checkError)
    throw new Error("Failed to add reaction")
  }

  // If reaction exists, remove it (toggle behavior)
  if (existingReaction) {
    const { error: deleteError } = await supabase.from("community_reactions").delete().eq("id", existingReaction.id)

    if (deleteError) {
      console.error("Error removing reaction:", deleteError)
      throw new Error("Failed to remove reaction")
    }
  } else {
    // Otherwise, add the reaction
    const { error: insertError } = await supabase.from("community_reactions").insert({
      post_id: postId,
      user_id: session.user.id,
      reaction_type: reactionType,
    })

    if (insertError) {
      console.error("Error adding reaction:", insertError)
      throw new Error("Failed to add reaction")
    }
  }

  // Get the topic info for revalidation
  const { data: post, error: postError } = await supabase
    .from("community_posts")
    .select("topic_id")
    .eq("id", postId)
    .single()

  if (postError) {
    console.error("Error getting post:", postError)
    return { success: true } // Still return success since the reaction was toggled
  }

  const { data: topic, error: topicError } = await supabase
    .from("community_topics")
    .select("slug, category:community_categories(slug)")
    .eq("id", post.topic_id)
    .single()

  if (topicError) {
    console.error("Error getting topic:", topicError)
    return { success: true } // Still return success since the reaction was toggled
  }

  revalidatePath(`/community/${topic.category.slug}/${topic.slug}`)
  return { success: true }
}

// Mark a post as solution
export async function markAsSolution(postId: number, topicId: number) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("You must be logged in to mark a solution")
  }

  const supabase = createClient()

  // Check if user is the topic author or an admin
  const { data: topic, error: topicError } = await supabase
    .from("community_topics")
    .select("author_id, slug, category:community_categories(slug)")
    .eq("id", topicId)
    .single()

  if (topicError) {
    console.error("Error checking topic:", topicError)
    throw new Error("Failed to mark solution")
  }

  // Check if user is admin (simplified, you might have a more complex role system)
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL

  if (topic.author_id !== session.user.id && !isAdmin) {
    throw new Error("Only the topic author or an admin can mark a solution")
  }

  // Clear any existing solutions for this topic
  const { error: clearError } = await supabase
    .from("community_posts")
    .update({ is_solution: false })
    .eq("topic_id", topicId)
    .eq("is_solution", true)

  if (clearError) {
    console.error("Error clearing existing solutions:", clearError)
    throw new Error("Failed to mark solution")
  }

  // Mark the new solution
  const { error: markError } = await supabase.from("community_posts").update({ is_solution: true }).eq("id", postId)

  if (markError) {
    console.error("Error marking solution:", markError)
    throw new Error("Failed to mark solution")
  }

  revalidatePath(`/community/${topic.category.slug}/${topic.slug}`)
  return { success: true }
}

// Search community
export async function searchCommunity(query: string): Promise<CommunityTopic[]> {
  if (!query || query.length < 3) {
    return []
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from("unified_search_index")
    .select("*")
    .eq("content_type", "community_topic")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error("Error searching community:", error)
    return []
  }

  // Fetch the actual topics
  if (data.length > 0) {
    const topicIds = data.map((item) => item.content_id)

    const { data: topics, error: topicsError } = await supabase
      .from("community_topics")
      .select(`
        *,
        category:community_categories(*),
        author:author_id(name, email, image)
      `)
      .in("id", topicIds)
      .eq("status", "open")

    if (topicsError) {
      console.error("Error fetching search results:", topicsError)
      return []
    }

    return topics || []
  }

  return []
}

// Get trending topics
export async function getTrendingTopics(): Promise<CommunityTopic[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_topics")
    .select(`
      *,
      category:community_categories(*),
      author:author_id(name, email, image),
      post_count:community_posts(count)
    `)
    .eq("status", "open")
    .order("view_count", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching trending topics:", error)
    return []
  }

  return data || []
}

// Get recent topics
export async function getRecentTopics(): Promise<CommunityTopic[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("community_topics")
    .select(`
      *,
      category:community_categories(*),
      author:author_id(name, email, image),
      post_count:community_posts(count)
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching recent topics:", error)
    return []
  }

  return data || []
}
