import { headers } from "next/headers"
import DebugClient from "./components/debug-client"
import LoadingManagerOverride from "./components/loading-manager-override"

export default function DebugPage() {
  // Check if nojs query parameter is present
  const headersList = headers()
  const url = headersList.get("x-url") || ""
  const noJs = url.includes("nojs=true")

  return (
    <div style={{ color: "white" }}>
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>

      {/* Only include client components if noJs is false */}
      {!noJs && (
        <>
          <DebugClient />
          <LoadingManagerOverride />
        </>
      )}

      {/* Show a message if noJs is true */}
      {noJs && (
        <div className="bg-black bg-opacity-30 p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">JavaScript Disabled Mode</h2>
          <p className="mb-2">
            You are viewing this page with client-side JavaScript disabled via the nojs=true parameter.
          </p>
          <p>This can help diagnose issues with JavaScript errors causing the page to crash.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="/debug/favicon" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Favicon Debug</h3>
          <p className="text-white">Inspect all favicon assets and manifest files</p>
        </a>

        <a href="/debug/preloader" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Preloader Debug</h3>
          <p className="text-white">Analyze and fix preloader issues</p>
        </a>

        <a href="/debug/loading-manager" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Loading Manager</h3>
          <p className="text-white">Override the loading manager</p>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="/debug-minimal.html" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Minimal Debug</h3>
          <p className="text-white">Ultra-minimal HTML-only debug page</p>
        </a>

        <a href="/debug-static.html" className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md">
          <h3 className="font-bold text-lg mb-2">Static Debug Page</h3>
          <p className="text-white">View a completely static HTML debug page</p>
        </a>

        <a
          href={`${url.includes("?") ? "&" : "?"}nojs=true`}
          className="block bg-black bg-opacity-30 p-6 rounded shadow hover:shadow-md"
        >
          <h3 className="font-bold text-lg mb-2">Toggle JS Mode</h3>
          <p className="text-white">{noJs ? "Enable" : "Disable"} client-side JavaScript</p>
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
        <p className="mb-2">
          If the page flashes and then disappears, try the{" "}
          <a href="/debug?nojs=true" className="underline">
            No JS Mode
          </a>{" "}
          or the{" "}
          <a href="/debug-minimal.html" className="underline">
            Minimal Debug Page
          </a>
          .
        </p>
      </div>
    </div>
  )
}
