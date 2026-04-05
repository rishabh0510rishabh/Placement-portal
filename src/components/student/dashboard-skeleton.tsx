import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/5 p-8 md:p-12 mb-8 h-[200px] md:h-[280px]">
        <div className="space-y-4">
          <Skeleton className="h-10 md:h-14 w-3/4 max-w-[400px]" />
          <Skeleton className="h-4 md:h-6 w-full max-w-[600px]" />
          <Skeleton className="h-4 md:h-6 w-2/3 max-w-[400px]" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/5 border-white/10 overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-16" />
                </div>
                <Skeleton className="h-14 w-14 rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
          <Card className="bg-white/5 border-white/10 overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-8 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-20 ml-auto" />
                      <Skeleton className="h-3 w-24 ml-auto" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:space-y-10">
          <Card className="bg-white/5 border-white/10 h-full shadow-xl">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-white/5 pb-6">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative pl-6 space-y-2">
                  <Skeleton className="absolute left-[-2px] top-1.5 w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
