import Image from "next/image"

export default function FaviconDebugPage() {
  const faviconAssets = [
    { name: "favicon.ico", path: "/favicon.ico", size: "16x16, 32x32" },
    { name: "web-app-manifest-192x192.png", path: "/web-app-manifest-192x192.png", size: "192x192" },
    { name: "web-app-manifest-512x512.png", path: "/web-app-manifest-512x512.png", size: "512x512" },
    { name: "icon0.svg", path: "/icon0.svg", size: "Vector" },
    { name: "icon1.png", path: "/icon1.png", size: "Variable" },
    { name: "apple-icon.png", path: "/apple-icon.png", size: "180x180" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favicon Debug</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manifest Files</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">manifest.json</h3>
            <pre className="bg-gray-100 p-2 mt-2 overflow-auto text-xs rounded">
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
  "display": "standalone"
}`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">site.webmanifest</h3>
            <pre className="bg-gray-100 p-2 mt-2 overflow-auto text-xs rounded">
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
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "display": "standalone"
}`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Favicon Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faviconAssets.map((asset) => (
            <div key={asset.name} className="bg-white p-4 rounded shadow">
              <h3 className="font-medium">{asset.name}</h3>
              <p className="text-sm text-gray-500">Size: {asset.size}</p>
              <p className="text-sm text-gray-500 mb-2">Path: {asset.path}</p>
              <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                <div className="text-center">
                  {/* Use next/image for better handling */}
                  <div className="relative w-16 h-16 mx-auto">
                    <Image
                      src={asset.path || "/placeholder.svg"}
                      alt={asset.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  </div>
                  <span className="block mt-2 text-xs text-gray-500">
                    {asset.name.split(".").pop()?.toUpperCase()} format
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs">
                <a
                  href={asset.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in new tab
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">HTML Head Tags</h2>
        <div className="bg-white p-4 rounded shadow">
          <pre className="bg-gray-100 p-2 overflow-auto text-xs rounded">
            {`<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/svg+xml" href="/icon0.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />`}
          </pre>
        </div>
      </section>
    </div>
  )
}
