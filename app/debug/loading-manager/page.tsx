import type { Metadata } from "next"
import LoadingManagerOverride from "../components/loading-manager-override"

export const metadata: Metadata = {
  title: "Loading Manager Debug | Big Based",
  description: "Debug loading states and transitions",
}

export default function LoadingManagerDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Loading Manager Debug</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Loading State Testing</h2>
        <p className="text-gray-600 dark:text-gray-300">Test loading states and transitions</p>
      </div>
      <div style={{ color: "white" }}>
        {/* Include the loading manager override component */}
        <LoadingManagerOverride />

        <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Loading Manager Status</h2>
          <p className="mb-4">
            This page attempts to override the loading manager and force it to complete. If you're seeing this content,
            the override was successful.
          </p>
          <p className="mb-4">
            The preloader is getting stuck at 67%, which suggests that the loading manager is waiting for specific
            resources to complete loading. This page tries to force those resources to be marked as loaded.
          </p>
          <p>
            Check the browser console for detailed logs about what resources are being tracked and what actions are
            being taken.
          </p>
        </div>

        <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual Override Instructions</h2>
          <p className="mb-4">
            If you're still seeing the preloader, you can try manually overriding it by running the following code in
            the browser console:
          </p>
          <pre className="bg-black p-4 rounded overflow-x-auto">
            {`// Try to access the loading manager
if (window.loadingManager) {
  // Mark all resources as loaded
  const resources = window.loadingManager.getResourcesStatus();
  Object.keys(resources).forEach(id => {
    window.loadingManager.resourceLoaded(id);
  });
  
  // Reset the loading manager
  window.loadingManager.reset();
}`}
          </pre>
        </div>

        <div className="bg-black bg-opacity-30 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <a href="/debug" className="text-white underline">
                Back to Debug Home
              </a>
            </li>
            <li>
              <a href="/debug-static.html" className="text-white underline">
                View Static Debug Page
              </a>
            </li>
            <li>
              <a href="/" className="text-white underline">
                Return to Main Site
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
