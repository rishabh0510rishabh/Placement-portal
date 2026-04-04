"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, ClipboardList, CheckCircle2, Clock, Bell, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Active Jobs", value: "12", icon: Building2, color: "text-[#22c55e]", bg: "bg-[#22c55e]/10" },
  { label: "Applications", value: "5", icon: ClipboardList, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
  { label: "Shortlisted", value: "2", icon: CheckCircle2, color: "text-[#a855f7]", bg: "bg-[#a855f7]/10" },
  { label: "Pending", value: "3", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
]

const recentNotifications = [
  { id: 1, message: "New job posting: Software Developer at Zomato", time: "2 hours ago" },
  { id: 2, message: "Application status updated for Reliance Jio", time: "1 day ago" },
  { id: 3, message: "Shortlisted for TCS interview on Monday", time: "2 days ago" },
]

const recentJobs = [
  { id: 1, company: "Zomato", role: "SDE - I", ctc: "24.0 LPA", deadline: "Apr 15, 2026", status: "Active" },
  { id: 2, company: "Reliance Jio", role: "GET Trainee", ctc: "12.0 LPA", deadline: "Apr 20, 2026", status: "New" },
  { id: 3, company: "TCS", role: "ASE - Ninja", ctc: "3.96 LPA", deadline: "Apr 25, 2026", status: "Active" },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6 md:space-y-10 max-w-7xl mx-auto pb-10">
      {/* Header with Glass Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/[0.03] to-white/0 border border-white/5 p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/10 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Namaste, <span className="text-[#22c55e]">Rohan</span>
          </h1>
          <p className="text-gray-400 mt-4 text-base md:text-lg max-w-xl font-light">
            You have 3 recruitment processes active this week. Keep your profile updated for higher visibility.
          </p>
        </div>
      </div>

      {/* Responsive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1 flex items-baseline gap-2">
                    {stat.value}
                    <span className="text-[10px] text-gray-600 font-medium">TOTAL</span>
                  </p>
                </div>
                <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Layout - Responsive Flex/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Left Column - Actions & Jobs */}
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-[#22c55e]" />
                <CardTitle className="text-xl font-bold text-white tracking-tight">Recent Opportunities</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] border-[#22c55e]/20 text-[#22c55e]">View All</Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-[#22c55e]">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
                          {job.company}
                          {job.status === "New" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                          )}
                        </p>
                        <p className="text-sm text-gray-400 font-medium">{job.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:text-right border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                      <div className="sm:mr-8 text-left sm:text-right">
                        <p className="text-sm font-bold text-[#22c55e]">{job.ctc}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">ANNUAL PACKAGE</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notifications & Activities */}
        <div className="space-y-6 md:space-y-10">
          <Card className="bg-white/5 border-white/10 h-full backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-white/5 pb-6">
              <div className="p-2 rounded-lg bg-white/5">
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-xl font-bold text-white tracking-tight">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-[calc(100%-8px)] before:bg-white/10"
                  >
                    <div className="absolute left-[-2px] top-1.5 w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">{notification.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
