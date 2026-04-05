"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, ClipboardList, CheckCircle2, TrendingUp, ArrowRight, Loader2, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/metrics")
      const result = await res.json()
      if (res.ok) {
        setData(result)
      } else {
        toast.error(result.error || "Failed to fetch metrics")
      }
    } catch (err) {
      toast.error("Telemetry link failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const stats = [
    { label: "Total Students", value: data?.stats?.totalStudents || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Companies", value: data?.stats?.totalCompanies || 0, icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Job Postings", value: data?.stats?.totalJobs || 0, icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Applications", value: data?.stats?.totalApplications || 0, icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]

  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1 font-light tracking-wide italic">Holistic overview of placement ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">Telemetry Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <Card className="bg-white/5 border-white/10 min-h-[400px]">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-bold text-white tracking-tight">System Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data?.recentApplications?.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold border border-white/10 italic">
                      {app.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-tight">{app.user?.fullName}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
                        {app.job?.role} @ <span className="text-primary">{app.job?.company?.name}</span>
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest">{app.status}</Badge>
                </div>
              ))}
              {(!data?.recentApplications || data?.recentApplications.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                   <ClipboardList className="h-16 w-16 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest">No Engagement Logged</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 h-full">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-bold text-white tracking-tight">Demand Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {data?.topCompanies?.map((company: any, index: number) => (
                <div key={company.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-600 w-4">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-bold text-white tracking-tight">{company.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {company.applications} Apps
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                      style={{ width: `${(company.applications / (data.topCompanies[0]?.applications || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!data?.topCompanies || data?.topCompanies.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                   <Building2 className="h-16 w-16 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest">No Active Pipelines</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
