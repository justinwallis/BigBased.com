import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Inline script to handle theme detection and prevent flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
      (function() {
        try {
          // Check for saved theme preference
          const savedTheme = localStorage.getItem('theme');
          
          // Check for system preference if no saved theme
          const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Determine the theme
          const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
          
          // Apply theme to document
          if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#111827'; // dark:bg-gray-900
            document.body.style.backgroundColor = '#111827';
            
            // Also update any preloader elements that might exist
            const preloader = document.getElementById('initial-preloader');
            if (preloader) {
              preloader.style.backgroundColor = '#111827';
              
              // Update text colors in preloader
              const textElements = preloader.querySelectorAll('p, div, span');
              textElements.forEach(el => {
                el.style.color = '#e5e5e5';
              });
              
              // Update binary code elements if they exist
              const binaryElements = preloader.querySelectorAll('.binary-row span');
              binaryElements.forEach(el => {
                el.style.color = '#ffffff';
              });
            }
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#ffffff';
            document.body.style.backgroundColor = '#ffffff';
            
            // Also update any preloader elements that might exist
            const preloader = document.getElementById('initial-preloader');
            if (preloader) {
              preloader.style.backgroundColor = '#ffffff';
            }
          }
        } catch (e) {
          console.error('Theme detection failed:', e);
        }
      })();
    `,
        }}
      />
      <body>{children}</body>
    </html>
  )
}
