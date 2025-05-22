import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initDatabase() {
  console.log("Initializing CMS database...")

  // Create pages table
  const { error: pagesError } = await supabase.rpc("create_pages_table")
  if (pagesError) {
    console.error("Error creating pages table:", pagesError)
  } else {
    console.log("Pages table created or already exists")
  }

  // Create posts table
  const { error: postsError } = await supabase.rpc("create_posts_table")
  if (postsError) {
    console.error("Error creating posts table:", postsError)
  } else {
    console.log("Posts table created or already exists")
  }

  // Create categories table
  const { error: categoriesError } = await supabase.rpc("create_categories_table")
  if (categoriesError) {
    console.error("Error creating categories table:", categoriesError)
  } else {
    console.log("Categories table created or already exists")
  }

  // Create post_categories table
  const { error: postCategoriesError } = await supabase.rpc("create_post_categories_table")
  if (postCategoriesError) {
    console.error("Error creating post_categories table:", postCategoriesError)
  } else {
    console.log("Post categories table created or already exists")
  }

  // Create media table
  const { error: mediaError } = await supabase.rpc("create_media_table")
  if (mediaError) {
    console.error("Error creating media table:", mediaError)
  } else {
    console.log("Media table created or already exists")
  }

  console.log("Database initialization complete")
}

initDatabase().catch((error) => {
  console.error("Error initializing database:", error)
  process.exit(1)
})
