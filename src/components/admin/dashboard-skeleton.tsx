import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/5 border-white/10 overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-white/5 border-white/10 overflow-hidden shadow-xl min-h-[400px]">
            <CardHeader className="border-b border-white/5 pb-6">
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
