import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(req: NextRequest) {
  try {
    // Create a connection to the database
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // Get posts from the database
    const posts =
      await sql`SELECT id, title, slug, excerpt, "featuredImage", "publishedAt", "_status", "createdAt", "updatedAt" FROM posts ORDER BY "createdAt" DESC`

    // Check if HTML is requested
    const url = new URL(req.url)
    const format = url.searchParams.get("format")

    if (format === "html") {
      // Return HTML response
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Posts - Big Based CMS</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 min-h-screen">
          <div class="container mx-auto px-4 py-8">
            <header class="bg-white shadow rounded-lg p-6 mb-8">
              <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">Posts</h1>
                <a href="/api/payload" class="text-blue-600 hover:underline">Back to Dashboard</a>
              </div>
            </header>
            
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${
                    posts.length > 0
                      ? posts
                          .map(
                            (post) => `
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${post.title || "Untitled"}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">${post.slug || ""}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post._status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }">
                          ${post._status || "draft"}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </td>
                    </tr>
                  `,
                          )
                          .join("")
                      : `
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                      No posts found. Create your first post to get started.
                    </td>
                  </tr>
                  `
                  }
                </tbody>
              </table>
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
    }

    // Return JSON response
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
