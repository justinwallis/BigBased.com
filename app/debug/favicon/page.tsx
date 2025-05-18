import Image from "next/image"
import Link from "next/link"

export default function FaviconDebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favicon Debug</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Favicon Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Favicon.ico */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">favicon.ico</h3>
              <Link href="/favicon.ico" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
              <img src="/favicon.ico" alt="Favicon" className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Multi-size ICO file for legacy browsers
            </p>
          </div>

          {/* Web App Manifest 192x192 */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">web-app-manifest-192x192.png</h3>
              <Link href="/web-app-manifest-192x192.png" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
              <img src="/web-app-manifest-192x192.png" alt="Web App Manifest 192x192" className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              192x192 PNG for Android home screen
            </p>
          </div>

          {/* Web App Manifest 512x512 */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">web-app-manifest-512x512.png</h3>
              <Link href="/web-app-manifest-512x512.png" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
              <img src="/web-app-manifest-512x512.png" alt="Web App Manifest 512x512" className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              512x512 PNG for Android splash screen
            </p>
          </div>

          {/* Apple Touch Icon */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">apple-touch-icon.png</h3>
              <Link href="/apple-touch-icon.png" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
              <img src="/apple-touch-icon.png" alt="Apple Touch Icon" className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              180x180 PNG for iOS home screen
            </p>
          </div>

          {/* SVG Icon */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">icon0.svg</h3>
              <Link href="/icon0.svg" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
              <img src="/icon0.svg" alt="SVG Icon" className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Scalable vector icon for modern browsers
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manifest Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* manifest.json */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">manifest.json</h3>
              <Link href="/manifest.json" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
              {`{
  "name": "Big Based",
  "short_name": "BigBased",
  "icons": [
    {
      "src": "/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
}`}
            </pre>
          </div>

          {/* site.webmanifest */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">site.webmanifest</h3>
              <Link href="/site.webmanifest" target="_blank" className="text-blue-600 text-sm hover:underline">
                View
              </Link>
            </div>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
              {`{
  "name": "Big Based",
  "short_name": "BigBased",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">HTML Head Tags</h2>
        <div className="bg-white p-4 rounded shadow">
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
            {`<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/svg+xml" href="/icon0.svg" />
<link rel="icon" type="image/png" href="/icon1.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
<link rel="mask-icon" href="/safari-pinned-tab.png" color="#000000" />
<meta name="msapplication-TileColor" content="#ffffff" />
<meta name="theme-color" content="#ffffff" />`}
          </pre>
        </div>
      </section>
    </div>
  )
}
