export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Debug Page Not Found</h1>
      <p className="text-xl mb-8">The debug page you're looking for doesn't exist.</p>
      <div className="flex gap-4">
        <a href="/debug" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          Debug Home
        </a>
        <a href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Main Site
        </a>
      </div>
    </div>
  )
}
