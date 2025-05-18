"use client"

export default function PreloaderDebugPageClient() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Preloader Debug</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Components</h2>
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">The site uses the following preloader components:</p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-bold">1. ClientPreloaderContainer</h3>
              <p className="text-sm text-gray-600 mt-1">
                Located in{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">components/client-preloader-container.tsx</code>
              </p>
              <p className="text-sm mt-2">
                This is the main wrapper component that initializes the preloader. It's used in the root layout.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-bold">2. ClientPreloaderWrapper</h3>
              <p className="text-sm text-gray-600 mt-1">
                Located in{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">components/client-preloader-wrapper.tsx</code>
              </p>
              <p className="text-sm mt-2">
                This component handles the client-side initialization of the preloader and resource tracking.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-bold">3. Preloader</h3>
              <p className="text-sm text-gray-600 mt-1">
                Located in <code className="bg-gray-100 px-1 py-0.5 rounded">components/preloader.tsx</code>
              </p>
              <p className="text-sm mt-2">
                This is the actual preloader UI component that shows the loading animation and progress.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h3 className="font-bold">4. Inline Preloader Script</h3>
              <p className="text-sm text-gray-600 mt-1">
                Located in <code className="bg-gray-100 px-1 py-0.5 rounded">app/layout.tsx</code>
              </p>
              <p className="text-sm mt-2">
                There's also an inline script in the root layout that creates an initial preloader before React
                hydration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Common Preloader Issues</h2>
        <div className="bg-white p-6 rounded shadow">
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h3 className="font-bold">Duplicate Preloaders</h3>
              <p className="text-sm mt-2">
                If you see two preloaders, one of which gets stuck at a certain percentage, it's likely that:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>The inline script preloader isn't being properly removed when the React preloader initializes</li>
                <li>There are multiple instances of ClientPreloaderContainer in the component tree</li>
                <li>A custom layout is not properly overriding the root layout</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h3 className="font-bold">Stuck Preloader</h3>
              <p className="text-sm mt-2">If the preloader gets stuck at a certain percentage, it's likely that:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>A resource was registered but never marked as loaded</li>
                <li>There's an error in the resource loading callback</li>
                <li>The minimum loading time is set too high</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Fix for Duplicate Preloaders</h2>
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">To fix the issue with duplicate preloaders:</p>

          <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap mb-4">
            {`// In app/layout.tsx, ensure the inline script properly removes itself
// Add this to the inline preloader script:

// Remove the initial preloader when React preloader is ready
window.removeInitialPreloader = function() {
  const initialPreloader = document.getElementById('initial-preloader');
  if (initialPreloader) {
    initialPreloader.style.opacity = '0';
    setTimeout(() => {
      initialPreloader.remove();
    }, 500);
  }
};

// Then in components/preloader.tsx, call this function when the React preloader is ready:
useEffect(() => {
  if (typeof window !== 'undefined' && window.removeInitialPreloader) {
    window.removeInitialPreloader();
  }
}, []);`}
          </div>

          <p className="text-sm text-gray-600">
            This ensures that the inline preloader is properly removed when the React preloader is initialized,
            preventing duplicate preloaders from appearing.
          </p>
        </div>
      </section>
    </div>
  )
}
