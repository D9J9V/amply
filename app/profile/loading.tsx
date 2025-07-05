import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-amply-cream">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header Skeleton */}
          <div className="bg-amply-white rounded-3xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <Skeleton className="w-32 h-32 rounded-3xl bg-gray-200" />
              <div className="flex-1 text-center md:text-left space-y-4">
                <Skeleton className="h-8 w-48 bg-gray-200 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-32 bg-gray-200 mx-auto md:mx-0" />
                <Skeleton className="h-16 w-full bg-gray-200" />
                <div className="flex justify-center md:justify-start space-x-4">
                  <Skeleton className="h-10 w-24 bg-gray-200 rounded-2xl" />
                  <Skeleton className="h-10 w-24 bg-gray-200 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-amply-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-6 w-16 bg-gray-200" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-2xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-amply-white rounded-3xl p-6 shadow-card">
                <Skeleton className="h-48 w-full rounded-2xl bg-gray-200 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}