import type React from "react"
import "../globals.css"
import { headers } from "next/headers"

export const metadata = {
  title: "Big Based - Debug Tools",
  description: "Debugging tools for Big Based website",
  // Add the preloader disabled meta tag through the metadata API
  other: {
    preloader: "disabled",
  },
}

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if nojs query parameter is present
  const headersList = headers()
  const url = headersList.get("x-url") || ""
  const noJs = url.includes("nojs=true")

  return (
    <html lang="en">
      {/* No manual head tag */}
      <body style={{ backgroundColor: "#ff00ff", color: "white" }}>
        <div className="min-h-screen" style={{ backgroundColor: "#ff00ff" }}>
          <header className="bg-black text-white p-4">
            <div className="container mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold">Big Based Debug Tools</h1>
                <nav>
                  <ul className="flex flex-wrap gap-4">
                    <li>
                      <a href="/debug" className="text-white hover:underline">
                        Debug Home
                      </a>
                    </li>
                    <li>
                      <a href="/debug-minimal.html" className="text-white hover:underline">
                        Minimal Debug
                      </a>
                    </li>
                    <li>
                      <a href="/debug-static.html" className="text-white hover:underline">
                        Static Debug
                      </a>
                    </li>
                    <li>
                      <a href="/" className="text-white hover:underline bg-red-600 px-3 py-1 rounded">
                        Main Site
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>

          <main className="container mx-auto p-4" style={{ backgroundColor: "#ff00ff" }}>
            {children}
          </main>

          <footer className="bg-black p-4 text-center text-white">
            <p>Big Based Debug Tools - For Development Use Only</p>
          </footer>
        </div>

        {/* Only include the script if noJs is false */}
        {!noJs && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              console.log("Debug page - Executing preloader removal");
              
              // Function to remove preloader elements
              function removePreloaders() {
                console.log("Attempting to remove preloaders");
                
                // Remove any element with 'preloader' in its ID or class
                var preloaders = document.querySelectorAll('[id*="preloader"], [class*="preloader"]');
                console.log("Found " + preloaders.length + " preloader elements");
                
                preloaders.forEach(function(el) {
                  if (el && el.parentNode) {
                    console.log("Removing preloader element:", el);
                    el.parentNode.removeChild(el);
                  }
                });
                
                // Remove any inline preloader
                var initialPreloader = document.getElementById('initial-preloader');
                if (initialPreloader && initialPreloader.parentNode) {
                  console.log("Removing initial preloader");
                  initialPreloader.parentNode.removeChild(initialPreloader);
                }
                
                // Clear any preloader-related intervals
                for (var i = 1; i < 10000; i++) {
                  clearInterval(i);
                }
                
                // Remove any fixed or absolute positioned elements that might be preloaders
                var possiblePreloaders = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"], div[style*="position: absolute"], div[style*="position:absolute"]');
                possiblePreloaders.forEach(function(el) {
                  if (el && el.parentNode && (el.style.zIndex > 100 || el.style.zIndex === '')) {
                    console.log("Removing possible preloader element:", el);
                    el.style.display = 'none';
                  }
                });
                
                // Force body to be visible
                document.body.style.display = 'block';
                document.body.style.visibility = 'visible';
                document.body.style.opacity = '1';
              }
              
              // Run immediately
              removePreloaders();
              
              // Run again when DOM is ready
              document.addEventListener('DOMContentLoaded', removePreloaders);
              
              // Run again after a short delay
              setTimeout(removePreloaders, 100);
              setTimeout(removePreloaders, 500);
              setTimeout(removePreloaders, 1000);
              
              // Run again after window load
              window.addEventListener('load', removePreloaders);
            `,
            }}
          />
        )}

        {/* Add meta refresh to redirect to minimal debug page if this page doesn't load properly */}
        <noscript>
          <meta httpEquiv="refresh" content="3;url=/debug-minimal.html" />
          <div className="bg-black bg-opacity-50 p-4 rounded text-center">
            <p>JavaScript is disabled. Redirecting to minimal debug page in 3 seconds...</p>
            <p>
              <a href="/debug-minimal.html" className="underline">
                Click here if you are not redirected
              </a>
            </p>
          </div>
        </noscript>
      </body>
    </html>
  )
}
