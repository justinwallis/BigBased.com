export function WebsiteShowcaseSkeleton() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-3 animate-pulse"></div>
          <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded-md mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo scroller skeleton */}
          <div className="md:col-span-1">
            <div className="flex justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="h-[400px] bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 mb-4 p-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Website preview skeleton */}
          <div className="md:col-span-2 h-[500px]">
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 md:h-56 lg:h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 py-3 px-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto"></div>
                </div>
                <div className="flex-1 py-3 px-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto"></div>
                </div>
                <div className="flex-1 py-3 px-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto"></div>
                </div>
              </div>
              <div className="p-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
