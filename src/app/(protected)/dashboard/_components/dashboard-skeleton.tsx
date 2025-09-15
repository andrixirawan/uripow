import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-80 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="h-20 w-80 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Quick View Skeleton */}
      <Card>
        <div className="p-6">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Navigation Skeleton */}
      <Card>
        <div className="p-6">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
