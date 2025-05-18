export default function NotFound() {
  return (
    <div style={{ color: "white" }}>
      <h1 className="text-2xl font-bold mb-6">Debug Page Not Found</h1>

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <p className="mb-4">The debug page you're looking for doesn't exist.</p>
        <p>
          <a href="/debug" className="text-white underline">
            Return to Debug Home
          </a>
        </p>
      </div>
    </div>
  )
}
