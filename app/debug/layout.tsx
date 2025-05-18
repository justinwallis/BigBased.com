import type React from "react"
import "../globals.css"

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
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
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
                      <a href="/debug/favicon" className="text-white hover:underline">
                        Favicon
                      </a>
                    </li>
                    <li>
                      <a href="/debug/preloader" className="text-white hover:underline">
                        Preloader
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

          <main className="container mx-auto p-4">{children}</main>

          <footer className="bg-gray-200 p-4 text-center">
            <p className="text-gray-600">Big Based Debug Tools - For Development Use Only</p>
          </footer>
        </div>

        {/* Add a script to remove any preloader elements */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Remove any preloader elements
            document.addEventListener('DOMContentLoaded', function() {
              // Remove any element with 'preloader' in its ID or class
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
              if (window.preloaderIntervals) {
                window.preloaderIntervals.forEach(function(interval) {
                  clearInterval(interval);
                });
              }
            });
          `,
          }}
        />
      </body>
    </html>
  )
}
