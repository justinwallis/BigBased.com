import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Create a completely static HTML response
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Big Based - Debug Page (Static Route)</title>
  <style>
    body {
      background-color: #ff00ff;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
    }
    header {
      background-color: black;
      padding: 20px;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
    }
    nav {
      margin-top: 10px;
    }
    nav a {
      color: white;
      margin-right: 15px;
      text-decoration: none;
    }
    nav a:hover {
      text-decoration: underline;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    footer {
      background-color: black;
      padding: 20px;
      text-align: center;
      margin-top: 20px;
    }
    .home-link {
      background-color: #ff0000;
      padding: 5px 10px;
      border-radius: 5px;
    }
  </style>
  <!-- Prevent any JavaScript from loading -->
  <meta http-equiv="Content-Security-Policy" content="script-src 'none';">
</head>
<body>
  <header>
    <div class="container">
      <h1>Big Based Debug Tools (Static Route)</h1>
      <nav>
        <a href="/debug-static">Debug Home</a>
        <a href="/debug-static/favicon">Favicon Debug</a>
        <a href="/debug-static/preloader">Preloader Debug</a>
        <a href="/" class="home-link">Main Site</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <h2>Static Route Debug Page</h2>
    <p>This is a completely static HTML page served by a route handler with no JavaScript at all.</p>

    <div class="grid">
      <div class="card">
        <h3>Static Debug Pages</h3>
        <p>These pages are completely static HTML with no JavaScript:</p>
        <ul>
          <li><a href="/debug-static">Static Route Debug (this page)</a></li>
          <li><a href="/debug-static/favicon">Favicon Debug (Static)</a></li>
          <li><a href="/debug-static/preloader">Preloader Debug (Static)</a></li>
        </ul>
      </div>

      <div class="card">
        <h3>Other Debug Pages</h3>
        <p>These pages might not work if there are JavaScript errors:</p>
        <ul>
          <li><a href="/debug">Next.js Debug Home</a></li>
          <li><a href="/debug-minimal.html">Minimal HTML Debug</a></li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>Environment Information</h3>
      <p>NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || "Not set"}</p>
      <p>Current URL: ${request.url}</p>
    </div>

    <div class="card">
      <h3>Troubleshooting</h3>
      <p>This page is served by a route handler that returns static HTML with no JavaScript.</p>
      <p>It has a Content-Security-Policy that prevents any JavaScript from running.</p>
      <p>If you're seeing this page but other debug pages don't work, there might be a JavaScript error or preloader issue.</p>
    </div>
  </main>

  <footer>
    <p>Big Based Debug Tools - For Development Use Only</p>
  </footer>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store",
    },
  })
}
