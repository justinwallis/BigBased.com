import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Create a completely static HTML response
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Big Based - Favicon Debug (Static Route)</title>
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
    .favicon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
    }
    .favicon-item {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      padding: 10px;
      text-align: center;
    }
    .favicon-item img {
      max-width: 100%;
      height: auto;
      margin-bottom: 10px;
    }
  </style>
  <!-- Prevent any JavaScript from loading -->
  <meta http-equiv="Content-Security-Policy" content="script-src 'none';">
</head>
<body>
  <header>
    <div class="container">
      <h1>Big Based Favicon Debug (Static Route)</h1>
      <nav>
        <a href="/debug-static">Debug Home</a>
        <a href="/debug-static/favicon">Favicon Debug</a>
        <a href="/debug-static/preloader">Preloader Debug</a>
        <a href="/" class="home-link">Main Site</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <h2>Favicon Debug Page</h2>
    <p>This page shows all favicon assets and manifest files.</p>

    <div class="card">
      <h3>Favicon Assets</h3>
      <div class="favicon-grid">
        <div class="favicon-item">
          <img src="/favicon.ico" alt="favicon.ico">
          <p>favicon.ico</p>
        </div>
        <div class="favicon-item">
          <img src="/favicon-16x16.png" alt="favicon-16x16.png">
          <p>favicon-16x16.png</p>
        </div>
        <div class="favicon-item">
          <img src="/favicon-32x32.png" alt="favicon-32x32.png">
          <p>favicon-32x32.png</p>
        </div>
        <div class="favicon-item">
          <img src="/apple-touch-icon.png" alt="apple-touch-icon.png">
          <p>apple-touch-icon.png</p>
        </div>
        <div class="favicon-item">
          <img src="/android-chrome-192x192.png" alt="android-chrome-192x192.png">
          <p>android-chrome-192x192.png</p>
        </div>
        <div class="favicon-item">
          <img src="/android-chrome-512x512.png" alt="android-chrome-512x512.png">
          <p>android-chrome-512x512.png</p>
        </div>
        <div class="favicon-item">
          <img src="/safari-pinned-tab.png" alt="safari-pinned-tab.png">
          <p>safari-pinned-tab.png</p>
        </div>
        <div class="favicon-item">
          <img src="/mstile-150x150.png" alt="mstile-150x150.png">
          <p>mstile-150x150.png</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Manifest Files</h3>
      <ul>
        <li><a href="/site.webmanifest" target="_blank">site.webmanifest</a></li>
        <li><a href="/browserconfig.xml" target="_blank">browserconfig.xml</a></li>
        <li><a href="/manifest.json" target="_blank">manifest.json</a></li>
      </ul>
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
