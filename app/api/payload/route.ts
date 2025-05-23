import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Connect to the database
const sql = neon(process.env.NEON_NEON_DATABASE_URL || "")

export async function GET(req: Request) {
  try {
    // Check if the request wants HTML or JSON
    const url = new URL(req.url)
    const format = url.searchParams.get("format") || "html"

    // Get counts for each collection
    const userCount = await sql`SELECT COUNT(*) FROM users`
    const pageCount = await sql`SELECT COUNT(*) FROM pages`
    const postCount = await sql`SELECT COUNT(*) FROM posts`
    const mediaCount = await sql`SELECT COUNT(*) FROM media`

    // If JSON is requested, return JSON data
    if (format === "json") {
      return NextResponse.json({
        collections: {
          users: Number(userCount[0].count),
          pages: Number(pageCount[0].count),
          posts: Number(postCount[0].count),
          media: Number(mediaCount[0].count),
        },
      })
    }

    // Otherwise, return HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Big Based CMS</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.5;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }
          .collections {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          .collection-card {
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .collection-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .collection-card h2 {
            margin-top: 0;
            font-size: 1.5rem;
            color: #2d3748;
          }
          .count {
            font-size: 2rem;
            font-weight: bold;
            color: #4a5568;
          }
          .view-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #3182ce;
            color: white;
            border-radius: 0.25rem;
            text-decoration: none;
            font-weight: 500;
          }
          .view-link:hover {
            background-color: #2c5282;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }
          .admin-link {
            padding: 0.5rem 1rem;
            background-color: #38a169;
            color: white;
            border-radius: 0.25rem;
            text-decoration: none;
            font-weight: 500;
          }
          .admin-link:hover {
            background-color: #2f855a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Big Based CMS Dashboard</h1>
          <a href="/admin" class="admin-link">Admin Setup</a>
        </div>
        <div class="collections">
          <div class="collection-card">
            <h2>Users</h2>
            <div class="count">${userCount[0].count}</div>
            <a href="/api/payload/users" class="view-link">View Users</a>
          </div>
          <div class="collection-card">
            <h2>Pages</h2>
            <div class="count">${pageCount[0].count}</div>
            <a href="/api/payload/pages" class="view-link">View Pages</a>
          </div>
          <div class="collection-card">
            <h2>Posts</h2>
            <div class="count">${postCount[0].count}</div>
            <a href="/api/payload/posts" class="view-link">View Posts</a>
          </div>
          <div class="collection-card">
            <h2>Media</h2>
            <div class="count">${mediaCount[0].count}</div>
            <a href="/api/payload/media" class="view-link">View Media</a>
          </div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error fetching collection counts:", error)
    return NextResponse.json({ error: "Failed to fetch collection counts" }, { status: 500 })
  }
}
