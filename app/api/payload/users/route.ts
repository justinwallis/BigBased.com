import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(req: NextRequest) {
  try {
    // Create a connection to the database
    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // Get users from the database (exclude password)
    const users =
      await sql`SELECT id, email, roles, name, "createdAt", "updatedAt" FROM users ORDER BY "createdAt" DESC`

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
          <title>Users - Big Based CMS</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 min-h-screen">
          <div class="container mx-auto px-4 py-8">
            <header class="bg-white shadow rounded-lg p-6 mb-8">
              <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">Users</h1>
                <a href="/api/payload" class="text-blue-600 hover:underline">Back to Dashboard</a>
              </div>
            </header>
            
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${
                    users.length > 0
                      ? users
                          .map(
                            (user) => `
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${user.name || "Unnamed"}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">${user.email}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        ${
                          Array.isArray(user.roles)
                            ? user.roles
                                .map(
                                  (role) => `
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }">
                            ${role}
                          </span>
                        `,
                                )
                                .join(" ")
                            : ""
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                      </td>
                    </tr>
                  `,
                          )
                          .join("")
                      : `
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                      No users found. Create your first user to get started.
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
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
