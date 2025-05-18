import Link from "next/link"

export default function DebugPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>

      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/debug/favicon" 
            className="block bg-white p-6 rounded shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg mb-2">Favicon Debug</h3>
            <p className="text-gray-600 text-sm">Inspect all favicon assets and manifest files</p>
          </Link>

          <Link 
            href="/debug/preloader" 
            className="block bg-white p-6 rounded shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg mb-2">Preloader Debug</h3>
            <p className="text-gray-600 text-sm">Analyze and fix preloader issues</p>
          </Link>

          <div className="block bg-white p-6 rounded shadow">
            <h3 className="font-bold text-lg mb-2">System Info</h3>
            <p className="text-gray-600 text-sm">View system and browser information</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Client-Side System Info</h2>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm mb-2">This information will be populated client-side:</p>
          <div id="system-info" className="bg-gray-100 p-4 rounded text-sm">
            <p>Loading system information...</p>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  const systemInfoEl = document.getElementById('system-info');
                  if (systemInfoEl) {
                    const info = {
                      userAgent: navigator.userAgent,
                      screenSize: \`\${window.screen.width}x\${window.screen.height}\`,
                      viewportSize: \`\${window.innerWidth}x\${window.innerHeight}\`,
                      devicePixelRatio: window.devicePixelRatio,
                      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      language: navigator.language,
                      online: navigator.onLine
                    };
                    
                    let html = '<table class="w-full">';
                    for (const [key, value] of Object.entries(info)) {
                      html += \`<tr class="border-b"><td class="py-2 font-medium">\${key}</td><td class="py-2">\${value}</td></tr>\`;
                    }
                    html += '</table>';
                    
                    systemInfoEl.innerHTML = html;
                  }
                });
              `,
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm mb-2">Local storage items will be shown here:</p>
          <div id="localStorage-items" className="bg-gray-100 p-4 rounded text-sm">
            <p>Loading local storage data...</p>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  const localStorageEl = document.getElementById('localStorage-items');
                  if (localStorageEl) {
                    if (Object.keys(localStorage).length === 0) {
                      localStorageEl.innerHTML = '<p>No items in local storage</p>';
                    } else {
                      let html = '<ul>';
                      for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key) {
                          const value = localStorage.getItem(key);
                          const displayValue = value && value.length > 50 ? value.substring(0, 50) + '...' : value;
                          html += \`<li class="py-1"><span class="font-semibold">\${key}:</span> <span>\${displayValue}</span></li>\`;
                        }
                      }
                      html += '</ul>';
                      localStorageEl.innerHTML = html;
                    }
                  }
                });
              `,
            }}
          />
        </div>
      </section>
    </div>
  )
}
