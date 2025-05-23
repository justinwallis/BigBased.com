import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(req: NextRequest) {
  try {
    // Create a connection to the database
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // Get media from the database
    const media =
      await sql`SELECT id, filename, "mimeType", filesize, width, height, alt, url, "createdAt", "updatedAt" FROM media ORDER BY "createdAt" DESC`

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
          <title>Media - Big Based CMS</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 min-h-screen">
          <div class="container mx-auto px-4 py-8">
            <header class="bg-white shadow rounded-lg p-6 mb-8">
              <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">Media</h1>
                <a href="/api/payload" class="text-blue-600 hover:underline">Back to Dashboard</a>
              </div>
            </header>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              ${
                media.length > 0
                  ? media
                      .map(
                        (item) => `
                <div class="bg-white shadow rounded-lg overflow-hidden">
                  <div class="h-48 bg-gray-200 flex items-center justify-center">
                    ${
                      item.url && (item.mimeType || "").startsWith("image/")
                        ? `<img src="${item.url}" alt="${item.alt || item.filename}" class="max-h-full max-w-full object-contain">`
                        : `<div class="text-gray-400 text-center p-4">${item.filename}</div>`
                    }
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 truncate" title="${item.filename}">${item.filename}</h3>
                    <p class="text-sm text-gray-500">${item.mimeType || "Unknown type"}</p>
                    <p class="text-sm text-gray-500">${item.filesize ? Math.round(item.filesize / 1024) + " KB" : "Unknown size"}</p>
                    <p class="text-sm text-gray-500">${item.width && item.height ? item.width + "×" + item.height : ""}</p>
                  </div>
                </div>
              `,
                      )
                      .join("")
                  : `
                <div class="col-span-full bg-white shadow rounded-lg p-6 text-center text-gray-500">
                  No media found. Upload your first media file to get started.
                </div>
              `
              }
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
    return NextResponse.json({ media })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch media",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
