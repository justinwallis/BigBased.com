export default function PreloaderDebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Preloader Debug</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Components</h2>
        <p className="mb-4">The Big Based website uses a React-based preloader component.</p>

        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>React Preloader Component</strong>
            <p className="text-gray-600 mt-1">
              This is a React component that provides a loading animation and tracks resource loading.
            </p>
          </li>
        </ol>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Stuck Preloader</h3>
            <p className="text-gray-600">
              This happens when a resource isn't properly marked as loaded. Check the console for errors and ensure all
              resources are properly tracked.
            </p>
          </div>

          <div>
            <h3 className="font-medium">White Flash</h3>
            <p className="text-gray-600">
              This happens when there's a gap between the preloader being removed and the content being rendered. Ensure
              smooth transitions between preloader and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
