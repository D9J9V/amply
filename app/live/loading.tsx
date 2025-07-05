import { Skeleton } from "@/components/ui/skeleton"

export default function LiveLoading() {
  return (
    <div className="min-h-screen bg-amply-cream">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-40 bg-gray-200" />
            <Skeleton className="h-10 w-32 bg-gray-200 rounded-2xl" />
          </div>

          {/* Categories Skeleton */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 bg-gray-200 rounded-2xl" />
            ))}
          </div>

          {/* Live Streams Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-amply-white rounded-3xl overflow-hidden shadow-card">
                <Skeleton className="h-48 w-full bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-3/4 bg-gray-200" />
                    <Skeleton className="h-4 w-4 bg-gray-200 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20 bg-gray-200" />
                    <Skeleton className="h-3 w-16 bg-gray-200" />
                  </div>
                  <Skeleton className="h-10 w-full bg-gray-200 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}