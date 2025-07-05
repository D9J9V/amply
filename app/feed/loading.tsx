import { Skeleton } from "@/components/ui/skeleton"

export default function FeedLoading() {
  return (
    <div className="min-h-screen bg-amply-cream">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200 rounded-2xl" />
          </div>

          {/* Feed Items Skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-amply-white rounded-3xl p-6 shadow-card">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-2xl bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-3 w-16 bg-gray-200" />
                </div>
              </div>
              <Skeleton className="h-48 w-full rounded-2xl bg-gray-200 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-3 w-1/2 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}