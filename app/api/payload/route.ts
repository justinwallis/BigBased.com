import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Create a connection to the database
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // Check if the database is connected
    const result = await sql`SELECT NOW()`

    // Return a simple admin interface
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Big Based CMS</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <header class="bg-white shadow rounded-lg p-6 mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Big Based CMS</h1>
            <p class="text-gray-600">Database connected successfully at ${result[0].now}</p>
          </header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Pages</h2>
              <p class="text-gray-600 mb-4">Manage your website pages</p>
              <a href="/api/payload/pages" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Pages</a>
            </div>
            
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Posts</h2>
              <p class="text-gray-600 mb-4">Manage your blog posts</p>
              <a href="/api/payload/posts" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Posts</a>
            </div>
            
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Media</h2>
              <p class="text-gray-600 mb-4">Manage your media files</p>
              <a href="/api/payload/media" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Media</a>
            </div>
            
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Users</h2>
              <p class="text-gray-600 mb-4">Manage your users</p>
              <a href="/api/payload/users" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Users</a>
            </div>
          </div>
          
          <div class="mt-8 bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">API Endpoints</h2>
            <ul class="list-disc pl-5 space-y-2">
              <li><code class="bg-gray-200 px-2 py-1 rounded">/api/payload/pages</code> - Pages API</li>
              <li><code class="bg-gray-200 px-2 py-1 rounded">/api/payload/posts</code> - Posts API</li>
              <li><code class="bg-gray-200 px-2 py-1 rounded">/api/payload/media</code> - Media API</li>
              <li><code class="bg-gray-200 px-2 py-1 rounded">/api/payload/users</code> - Users API</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json(
      {
        error: "Failed to serve admin UI",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
