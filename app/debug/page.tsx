export default function DebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="/debug/favicon" className="block bg-gray-100 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Favicon Debug</h3>
          <p className="text-gray-600">Inspect all favicon assets and manifest files</p>
        </a>

        <a href="/debug/preloader" className="block bg-gray-100 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Preloader Debug</h3>
          <p className="text-gray-600">Analyze and fix preloader issues</p>
        </a>

        <div className="block bg-gray-100 p-6 rounded shadow">
          <h3 className="font-bold text-lg mb-2">System Info</h3>
          <p className="text-gray-600">View system and browser information</p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment</h2>
        <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL || "Not set"}</p>
      </div>
    </div>
  )
}
