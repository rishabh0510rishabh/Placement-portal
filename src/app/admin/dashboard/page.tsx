"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, ClipboardList, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react"

const stats = [
  { label: "Total Students", value: "1,247", icon: Users, change: "+12%", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Companies", value: "45", icon: Building2, change: "+5%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Total Applications", value: "3,892", icon: ClipboardList, change: "+23%", color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Shortlisted", value: "856", icon: CheckCircle2, change: "+18%", color: "text-purple-500", bg: "bg-purple-500/10" },
]

const recentApplications = [
  { id: 1, student: "Rahul Kumar", company: "TCS", role: "Software Developer", status: "Applied" },
  { id: 2, student: "Priya Singh", company: "Infosys", role: "System Engineer", status: "Shortlisted" },
  { id: 3, student: "Amit Sharma", company: "Wipro", role: "Project Engineer", status: "Under Review" },
  { id: 4, student: "Sneha Gupta", company: "HCL", role: "GET", status: "Selected" },
  { id: 5, student: "Vikram Patel", company: "Cognizant", role: "Programmer Analyst", status: "Applied" },
]

const topCompanies = [
  { name: "TCS", applications: 245, shortlisted: 45 },
  { name: "Infosys", applications: 198, shortlisted: 38 },
  { name: "Wipro", applications: 156, shortlisted: 28 },
  { name: "HCL", applications: 134, shortlisted: 22 },
  { name: "Cognizant", applications: 112, shortlisted: 19 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6 md:space-y-10 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1 font-light tracking-wide italic">Holistic overview of placement ecosystem</p>
        </div>
        <div className="flex gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-2" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">System Live</span>
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
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-500">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">vs last month</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Recent Applications */}
        <Card className="bg-white/5 border-white/10 min-h-[400px]">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-bold text-white tracking-tight">Real-time Applications</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold border border-white/10">
                      {app.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-tight">{app.student}</p>
                      <p className="text-xs text-gray-500">
                        {app.role} at <span className="text-gray-400 font-medium">{app.company}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      app.status === "Selected"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : app.status === "Shortlisted"
                        ? "bg-blue-500/10 text-blue-500"
                        : app.status === "Under Review"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card className="bg-white/5 border-white/10 h-full">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-bold text-white tracking-tight">Demand Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {topCompanies.map((company, index) => (
                <div key={company.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-600 w-4">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-bold text-white tracking-tight">{company.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {company.applications} Apps
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(company.applications / 245) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-white/5">
               <button className="text-[10px] font-black text-gray-500 hover:text-[#22c55e] transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                  View Detailed Analytics <ArrowRight className="h-3 w-3" />
               </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
