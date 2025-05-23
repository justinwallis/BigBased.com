import { type NextRequest, NextResponse } from "next/server"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"

// Import collections
import { Users } from "@/app/payload/collections/Users"
import { Pages } from "@/app/payload/collections/Pages"
import { Posts } from "@/app/payload/collections/Posts"
import { Media } from "@/app/payload/collections/Media"

// Modify the connection string to disable SSL verification
function getModifiedConnectionString() {
  const originalString = process.env.POSTGRES_URL || ""

  // If the string already has parameters, append the SSL mode
  if (originalString.includes("?")) {
    return `${originalString}&sslmode=no-verify`
  }

  // Otherwise add the parameter with a question mark
  return `${originalString}?sslmode=no-verify`
}

// Create the config inline to avoid import issues
const payloadConfig = buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- Big Based CMS",
      favicon: "/favicon.ico",
      ogImage: "/og-image.png",
    },
  },
  collections: [Users, Pages, Posts, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "insecure-secret-for-dev-only",
  db: postgresAdapter({
    pool: {
      connectionString: getModifiedConnectionString(),
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  cors: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
  csrf: ["https://bigbased.com", "https://*.bigbased.com", "http://localhost:3000"],
})

// Serve a simple admin HTML page
export async function GET(req: NextRequest) {
  try {
    // Create a simple HTML page that will redirect to the Payload admin
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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            margin-bottom: 2rem;
          }
          .logo {
            width: 120px;
            height: auto;
            margin-bottom: 2rem;
          }
          .button {
            display: inline-block;
            background-color: #0070f3;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #0060df;
          }
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
            margin: 0 auto;
            text-align: left;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          label {
            font-weight: 500;
            color: #333;
          }
          input {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .submit-button {
            background-color: #0070f3;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .submit-button:hover {
            background-color: #0060df;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="/bb-logo.png" alt="Big Based Logo" class="logo">
          <h1>Big Based CMS</h1>
          <p>Welcome to the Big Based Content Management System. Please log in to continue.</p>
          
          <form class="login-form" id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="admin@bigbased.com" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="submit-button">Log In</button>
          </form>
        </div>

        <script>
          document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
              const response = await fetch('/api/payload/users/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                // Redirect to the dashboard or home page
                window.location.href = '/api/payload/pages';
              } else {
                alert('Login failed: ' + (data.message || 'Invalid credentials'));
              }
            } catch (error) {
              console.error('Login error:', error);
              alert('An error occurred during login. Please try again.');
            }
          });
        </script>
      </body>
      </html>
    `

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json(
      { error: "Failed to serve admin UI", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

// Handle POST requests for login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Check if this is a login request
    if (body.email && body.password) {
      // For now, just return a success response if the credentials match our admin user
      if (body.email === "admin@bigbased.com" && body.password === "BigBased2024!") {
        return NextResponse.json({
          user: {
            id: 1,
            email: "admin@bigbased.com",
            name: "Admin User",
            roles: ["admin"],
          },
          token: "mock-jwt-token",
        })
      } else {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
      }
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error processing admin POST request:", error)
    return NextResponse.json(
      { error: "Error processing request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
