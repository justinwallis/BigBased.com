import DebugClient from "./components/debug-client"

export default function DebugPage() {
  return (
    <div style={{ color: "white" }}>
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>

      <DebugClient />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="/debug/favicon" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Favicon Debug</h3>
          <p className="text-white">Inspect all favicon assets and manifest files</p>
        </a>

        <a href="/debug/preloader" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Preloader Debug</h3>
          <p className="text-white">Analyze and fix preloader issues</p>
        </a>

        <a href="/debug-static.html" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Static Debug Page</h3>
          <p className="text-white">View a completely static HTML debug page</p>
        </a>
      </div>

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment</h2>
        <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || "Not set"}</p>
      </div>

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
        <p className="mb-2">
          If you're seeing this page with a bright magenta background, the debug page is working correctly.
        </p>
        <p className="mb-2">If you're seeing a white screen, check the browser console for errors.</p>
        <p>Try the static debug page link above to see if that works better.</p>
      </div>
    </div>
  )
}
