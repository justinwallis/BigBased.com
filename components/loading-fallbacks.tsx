import { Skeleton } from "@/components/ui/skeleton"

export const MediaVotingPlatformSkeleton = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-3xl mx-auto" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mt-2" />
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-16 h-16 mr-4 rounded-md" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-2 w-full rounded-full mb-1" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export const HeroCarouselSkeleton = () => {
  return <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
}

export const LogoMarqueeSkeleton = () => {
  return <div className="w-full h-[60px] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
}

export const ContentSectionSkeleton = () => {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <Skeleton className="h-40 w-full rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-1" />
                <Skeleton className="h-4 w-4/6 mb-4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export const DomainMarqueeSkeleton = () => {
  return <div className="w-full h-[200px] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
}

export const WebsiteShowcaseSkeleton = () => {
  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-32 rounded-md" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
