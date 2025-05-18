import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Create a completely static HTML response
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Big Based - Preloader Debug (Static Route)</title>
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
    pre {
      background-color: rgba(0, 0, 0, 0.5);
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    code {
      font-family: monospace;
    }
  </style>
  <!-- Prevent any JavaScript from loading -->
  <meta http-equiv="Content-Security-Policy" content="script-src 'none';">
</head>
<body>
  <header>
    <div class="container">
      <h1>Big Based Preloader Debug (Static Route)</h1>
      <nav>
        <a href="/debug-static">Debug Home</a>
        <a href="/debug-static/favicon">Favicon Debug</a>
        <a href="/debug-static/preloader">Preloader Debug</a>
        <a href="/" class="home-link">Main Site</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <h2>Preloader Debug Page</h2>
    <p>This page provides information about the preloader and how to fix issues with it.</p>

    <div class="card">
      <h3>Preloader Issues</h3>
      <p>If you're experiencing issues with the preloader, such as:</p>
      <ul>
        <li>Preloader getting stuck at a certain percentage</li>
        <li>White screen with no content</li>
        <li>Page flashing and then disappearing</li>
      </ul>
      <p>Try the following solutions:</p>
    </div>

    <div class="card">
      <h3>Solution 1: Disable the Preloader</h3>
      <p>You can add a special query parameter to disable the preloader:</p>
      <pre><code>?nopreloader=true</code></pre>
      <p>Example: <a href="/?nopreloader=true">/?nopreloader=true</a></p>
    </div>

    <div class="card">
      <h3>Solution 2: Force Complete the Preloader</h3>
      <p>You can run this code in the browser console to force the preloader to complete:</p>
      <pre><code>// Try to access the loading manager
if (window.loadingManager) {
  // Mark all resources as loaded
  const resources = window.loadingManager.getResourcesStatus();
  Object.keys(resources).forEach(id => {
    window.loadingManager.resourceLoaded(id);
  });
  
  // Reset the loading manager
  window.loadingManager.reset();
}</code></pre>
    </div>

    <div class="card">
      <h3>Solution 3: Remove Preloader Elements</h3>
      <p>You can run this code in the browser console to remove preloader elements:</p>
      <pre><code>// Remove any element with 'preloader' in its ID or class
var preloaders = document.querySelectorAll('[id*="preloader"], [class*="preloader"]');
preloaders.forEach(function(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
});

// Remove any inline preloader
var initialPreloader = document.getElementById('initial-preloader');
if (initialPreloader && initialPreloader.parentNode) {
  initialPreloader.parentNode.removeChild(initialPreloader);
}

// Clear any preloader-related intervals
for (var i = 1; i < 10000; i++) {
  clearInterval(i);
}</code></pre>
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
