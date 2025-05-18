export default function FaviconDebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Favicon Debug</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Favicon Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded bg-white">
            <h3 className="font-medium mb-2">favicon.ico</h3>
            <div className="flex items-center">
              <img src="/favicon.ico" alt="favicon.ico" className="border mr-4" width={32} height={32} />
              <div>
                <p className="text-sm text-gray-600">Path: /favicon.ico</p>
                <p className="text-sm text-gray-600">Size: 32x32</p>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-white">
            <h3 className="font-medium mb-2">apple-icon.png</h3>
            <div className="flex items-center">
              <img src="/apple-icon.png" alt="apple-icon.png" className="border mr-4" width={60} height={60} />
              <div>
                <p className="text-sm text-gray-600">Path: /apple-icon.png</p>
                <p className="text-sm text-gray-600">Size: 180x180</p>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-white">
            <h3 className="font-medium mb-2">web-app-manifest-192x192.png</h3>
            <div className="flex items-center">
              <img
                src="/web-app-manifest-192x192.png"
                alt="web-app-manifest-192x192.png"
                className="border mr-4"
                width={60}
                height={60}
              />
              <div>
                <p className="text-sm text-gray-600">Path: /web-app-manifest-192x192.png</p>
                <p className="text-sm text-gray-600">Size: 192x192</p>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-white">
            <h3 className="font-medium mb-2">web-app-manifest-512x512.png</h3>
            <div className="flex items-center">
              <img
                src="/web-app-manifest-512x512.png"
                alt="web-app-manifest-512x512.png"
                className="border mr-4"
                width={60}
                height={60}
              />
              <div>
                <p className="text-sm text-gray-600">Path: /web-app-manifest-512x512.png</p>
                <p className="text-sm text-gray-600">Size: 512x512</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Manifest Files</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">manifest.json</h3>
            <p className="text-gray-600 mb-2">Path: /manifest.json</p>
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
              {`{
  "name": "Big Based",
  "short_name": "BB",
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
        </div>
      </div>
    </div>
  )
}
