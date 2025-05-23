export default function SecurityLogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Security Log</h1>
      <p className="mb-4">This page is temporarily unavailable while we set up the CMS.</p>
      <div className="flex gap-4">
        <a href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Admin Panel
        </a>
        <a href="/" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          Back to Home
        </a>
      </div>
    </div>
  )
}
