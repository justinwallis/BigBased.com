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
            margin-bottom: 1rem;
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
          .error-message {
            color: #e53e3e;
            margin-top: 1rem;
            display: none;
          }
          .success-message {
            color: #38a169;
            margin-top: 1rem;
            display: none;
          }
          .setup-section {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="/bb-logo.png" alt="Big Based Logo" class="logo">
          <h1>Big Based CMS</h1>
          
          <div class="setup-section">
            <h2>Database Setup</h2>
            <p>Before you can use the CMS, you need to set up the database tables.</p>
            <button id="setup-db-btn" class="button">Setup Database Tables</button>
            <div id="setup-status" class="success-message"></div>
            
            <div id="create-admin-section" style="display: none; margin-top: 2rem;">
              <h2>Create Admin User</h2>
              <form id="create-admin-form" class="login-form">
                <div class="form-group">
                  <label for="admin-email">Email</label>
                  <input type="email" id="admin-email" name="email" value="admin@bigbased.com" required>
                </div>
                <div class="form-group">
                  <label for="admin-password">Password</label>
                  <input type="password" id="admin-password" name="password" value="BigBased2024!" required>
                </div>
                <button type="submit" class="submit-button">Create Admin User</button>
              </form>
              <div id="admin-status" class="success-message"></div>
            </div>
          </div>
        </div>

        <script>
          // Setup database tables
          document.getElementById('setup-db-btn').addEventListener('click', async () => {
            const setupBtn = document.getElementById('setup-db-btn');
            const setupStatus = document.getElementById('setup-status');
            
            setupBtn.disabled = true;
            setupBtn.textContent = 'Setting up...';
            setupStatus.style.display = 'none';
            
            try {
              const response = await fetch('/api/payload/setup-tables', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ secret: '${process.env.PAYLOAD_SECRET}' }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                setupStatus.textContent = 'Database tables created successfully!';
                setupStatus.className = 'success-message';
                setupStatus.style.display = 'block';
                
                // Show the create admin section
                document.getElementById('create-admin-section').style.display = 'block';
              } else {
                setupStatus.textContent = 'Error: ' + (data.error || 'Failed to create tables');
                setupStatus.className = 'error-message';
                setupStatus.style.display = 'block';
              }
            } catch (error) {
              console.error('Setup error:', error);
              setupStatus.textContent = 'An error occurred during setup. Please try again.';
              setupStatus.className = 'error-message';
              setupStatus.style.display = 'block';
            } finally {
              setupBtn.disabled = false;
              setupBtn.textContent = 'Setup Database Tables';
            }
          });
          
          // Create admin user
          document.getElementById('create-admin-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const adminStatus = document.getElementById('admin-status');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            adminStatus.style.display = 'none';
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            try {
              const response = await fetch('/api/payload/create-admin', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  email, 
                  password,
                  secret: '${process.env.PAYLOAD_SECRET}'
                }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                adminStatus.textContent = 'Admin user created successfully! You can now access the CMS.';
                adminStatus.className = 'success-message';
                adminStatus.style.display = 'block';
                
                // Add a button to go to the CMS
                const cmsBtn = document.createElement('a');
                cmsBtn.href = '/api/payload/pages';
                cmsBtn.className = 'button';
                cmsBtn.textContent = 'Go to CMS';
                adminStatus.appendChild(document.createElement('br'));
                adminStatus.appendChild(document.createElement('br'));
                adminStatus.appendChild(cmsBtn);
              } else {
                adminStatus.textContent = 'Error: ' + (data.error || 'Failed to create admin user');
                adminStatus.className = 'error-message';
                adminStatus.style.display = 'block';
              }
            } catch (error) {
              console.error('Admin creation error:', error);
              adminStatus.textContent = 'An error occurred while creating the admin user. Please try again.';
              adminStatus.className = 'error-message';
              adminStatus.style.display = 'block';
            } finally {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Create Admin User';
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
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()

//     // Check if this is a login request
//     if (body.email && body.password) {
//       // For now, just return a success response if the credentials match our admin user
//       if (body.email === "admin@bigbased.com" && body.password === "BigBased2024!") {
//         return NextResponse.json({
//           user: {
//             id: 1,
//             email: "admin@bigbased.com",
//             name: "Admin User",
//             roles: ["admin"],
//           },
//           token: "mock-jwt-token",
//         })
//       } else {
//         return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
//       }
//     }

//     return NextResponse.json({ message: "Invalid request" }, { status: 400 })
//   } catch (error) {
//     console.error("Error processing admin POST request:", error)
//     return NextResponse.json(
//       { error: "Error processing request", details: error instanceof Error ? error.message : String(error) },
//       { status: 500 },
//     )
//   }
// }
