export const metadata = {
  title: "Big Based - Preloader Debug",
  description: "Debug preloader issues for Big Based website",
}

import PreloaderDebugPageClient from "./preloader-page-client"

export default function PreloaderDebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Preloader Debug</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Components</h2>
        <div className="bg-white p-4 rounded shadow">
          <p className="mb-4">
            The Big Based website uses two preloader components:
          </p>
          
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <strong>Inline Script Preloader</strong>
              <p className="text-sm text-gray-600 mt-1">
                This preloader is created by an inline script in the layout.tsx file and appears immediately before any React hydration.
                It shows a simple loading animation with the BB logo and a progress bar.
              </p>
            </li>
            
            <li>
              <strong>React Preloader Component</strong>
              <p className="text-sm text-gray-600 mt-1">
                This is a React component that takes over from the inline preloader once React has hydrated.
                It provides a more sophisticated animation and properly tracks resource loading.
              </p>
            </li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="font-medium">Common Issues</h3>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Duplicate preloaders appearing (fixed)</li>
              <li>Preloader getting stuck at a certain percentage</li>
              <li>White flash between preloader and content</li>
              <li>Preloader not being removed properly</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Preloader Code</h2>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Inline Script Preloader</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
{`// Create and show preloader immediately
(function() {
  // Define resource tracking functions first
  window.registerResource = function(id, weight) {
    if (!window.resourceStatus) {
      window.resourceStatus = {};
      window.totalResources = 0;
      window.resourcesLoaded = 0;
    }
    
    if (!window.resourceStatus[id]) {
      window.resourceStatus[id] = { status: 'pending', weight: weight || 1 };
      window.totalResources += (weight || 1);
      updateProgress();
    }
  };
  
  window.resourceLoaded = function(id) {
    if (window.resourceStatus && window.resourceStatus[id] && window.resourceStatus[id].status !== 'loaded') {
      window.resourcesLoaded += window.resourceStatus[id].weight;
      window.resourceStatus[id].status = 'loaded';
      updateProgress();
    }
  };
  
  // Function to remove the initial preloader
  window.removeInitialPreloader = function() {
    if (preloader && preloader.parentNode) {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 500);
    }
  };
  
  // ... rest of the preloader code
})();`}
          </pre>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">How to Fix Common Issues</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Duplicate Preloaders</h4>
              <p className="text-sm text-gray-600">
                This happens when the inline preloader isn't properly removed when the React preloader takes over.
                Solution: Ensure the React preloader calls window.removeInitialPreloader() when it's ready.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Stuck Preloader</h4>
              <p className="text-sm text-gray-600">
                This happens when a resource isn't properly marked as loaded.
                Solution: Check the console for errors and ensure all resources are properly tracked.
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs mt-1">
                {`// Check resource status in console
console.log(window.resourceStatus);`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">White Flash</h4>
              <p className="text-sm text-gray-600">
                This happens when there's a gap between the preloader being removed and the content being rendered.
                Solution: Ensure smooth transitions between preloader and content.
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
            <h3 className="font-medium">Debug Commands</h3>
            <p className="text-sm mt-1">
              You can run these commands in the browser console to debug preloader issues:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
{`// Force remove any preloaders
window.removeInitialPreloader && window.removeInitialPreloader();
document.querySelectorAll('[id*="preloader"], [class*="preloader"]').forEach(el => el.remove());

// Check resource loading status
console.log('Resource Status:', window.resourceStatus);
console.log('Total Resources:', window.totalResources);
console.log('Resources Loaded:', window.resourcesLoaded);`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
