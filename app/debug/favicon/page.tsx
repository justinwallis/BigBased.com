export default function FaviconDebugPage() {
  const faviconAssets = [
    { name: "favicon.ico", path: "/favicon.ico", size: "16x16, 32x32" },
    { name: "web-app-manifest-192x192.png", path: "/web-app-manifest-192x192.png", size: "192x192" },
    { name: "web-app-manifest-512x512.png", path: "/web-app-manifest-512x512.png", size: "512x512" },
    { name: "icon0.svg", path: "/icon0.svg", size: "Vector" },
    { name: "icon1.png", path: "/icon1.png", size: "Variable" },
    { name: "apple-icon.png", path: "/apple-icon.png", size: "180x180" },
    { name: "apple-touch-icon.png", path: "/apple-touch-icon.png", size: "180x180" },
    { name: "android-chrome-192x192.png", path: "/android-chrome-192x192.png", size: "192x192" },
    { name: "android-chrome-512x512.png", path: "/android-chrome-512x512.png", size: "512x512" },
    { name: "safari-pinned-tab.png", path: "/safari-pinned-tab.png", size: "Variable" },
    { name: "mstile-150x150.png", path: "/mstile-150x150.png", size: "150x150" },
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

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">browserconfig.xml</h3>
            <pre className="bg-gray-100 p-2 mt-2 overflow-auto text-xs rounded">
              {`<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#000000</TileColor>
        </tile>
    </msapplication>
</browserconfig>`}
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
                {asset.name.endsWith(".ico") ? (
                  <div className="text-center">
                    <img
                      src={asset.path || "/placeholder.svg"}
                      alt={asset.name}
                      className="mx-auto"
                      style={{ width: "32px", height: "32px" }}
                    />
                    <span className="block mt-2 text-xs text-gray-500">.ico format</span>
                  </div>
                ) : asset.name.endsWith(".svg") ? (
                  <div className="text-center">
                    <img
                      src={asset.path || "/placeholder.svg"}
                      alt={asset.name}
                      className="mx-auto"
                      style={{ width: "64px", height: "64px" }}
                    />
                    <span className="block mt-2 text-xs text-gray-500">SVG format</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={asset.path || "/placeholder.svg"}
                      alt={asset.name}
                      className="mx-auto max-h-24 max-w-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/abstract-geometric-shapes.png"
                        target.alt = "Image not found"
                      }}
                    />
                  </div>
                )}
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
            {`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000">
<meta name="msapplication-TileColor" content="#000000">
<meta name="theme-color" content="#ffffff">`}
          </pre>
        </div>
      </section>
    </div>
  )
}
