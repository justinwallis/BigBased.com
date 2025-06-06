import DebugClient from "../components/debug-client"
import LoadingManagerOverride from "../components/loading-manager-override"

export default function PreloaderDebugPage() {
  return (
    <div style={{ color: "white" }}>
      <h1 className="text-2xl font-bold mb-6">Preloader Debug</h1>

      {/* Include both client components */}
      <DebugClient />
      <LoadingManagerOverride />

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Status</h2>
        <p className="mb-4">
          If you're seeing this page with a bright magenta background, the preloader has been successfully disabled for
          debug pages.
        </p>
        <p className="mb-4">
          If the preloader is stuck at 67%, try the{" "}
          <a href="/debug/loading-manager" className="underline">
            Loading Manager Debug
          </a>{" "}
          page.
        </p>
        <p>
          If you're still seeing a white screen or the preloader, try the static debug page at{" "}
          <a href="/debug-static.html" className="underline">
            /debug-static.html
          </a>
        </p>
      </div>

      <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Removal Script</h2>
        <p className="mb-4">
          The debug pages include an aggressive script that attempts to remove any preloader elements as early as
          possible. This script runs in the head, on DOMContentLoaded, and after window load.
        </p>
        <p>
          Check the browser console for messages from this script to see if it's finding and removing any preloader
          elements.
        </p>
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
            <a href="/debug/loading-manager" className="text-white underline">
              Loading Manager Debug
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
  )
}
