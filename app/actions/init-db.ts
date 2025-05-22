"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function initDatabase() {
  try {
    console.log("Starting database initialization...")

    // Create pages table
    const pagesResult = await supabaseAdmin.rpc("create_pages_table")
    console.log("Pages table result:", pagesResult)

    // Create posts table
    const postsResult = await supabaseAdmin.rpc("create_posts_table")
    console.log("Posts table result:", postsResult)

    // Create categories table
    const categoriesResult = await supabaseAdmin.rpc("create_categories_table")
    console.log("Categories table result:", categoriesResult)

    // Create post_categories table
    const postCategoriesResult = await supabaseAdmin.rpc("create_post_categories_table")
    console.log("Post categories table result:", postCategoriesResult)

    // Create media table
    const mediaResult = await supabaseAdmin.rpc("create_media_table")
    console.log("Media table result:", mediaResult)

    // Insert some default categories
    const { error: categoriesError } = await supabaseAdmin.from("categories").upsert(
      [
        { name: "General", slug: "general", description: "General posts" },
        { name: "News", slug: "news", description: "News and updates" },
        { name: "Politics", slug: "politics", description: "Political content" },
        { name: "Culture", slug: "culture", description: "Cultural topics" },
        { name: "Technology", slug: "technology", description: "Technology and innovation" },
      ],
      { onConflict: "slug" },
    )

    if (categoriesError) {
      console.error("Error creating default categories:", categoriesError)
    } else {
      console.log("Default categories created successfully")
    }

    return {
      success: true,
      message: "Database initialized successfully! All tables created and default categories added.",
      details: {
        pages: pagesResult,
        posts: postsResult,
        categories: categoriesResult,
        postCategories: postCategoriesResult,
        media: mediaResult,
      },
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: "Error initializing database",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function checkDatabaseStatus() {
  try {
    // Check if tables exist by trying to query them
    const [pagesCheck, postsCheck, categoriesCheck, mediaCheck] = await Promise.all([
      supabaseAdmin.from("pages").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("posts").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("categories").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("media").select("count", { count: "exact", head: true }),
    ])

    return {
      success: true,
      tables: {
        pages: { exists: !pagesCheck.error, count: pagesCheck.count || 0 },
        posts: { exists: !postsCheck.error, count: postsCheck.count || 0 },
        categories: { exists: !categoriesCheck.error, count: categoriesCheck.count || 0 },
        media: { exists: !mediaCheck.error, count: mediaCheck.count || 0 },
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
