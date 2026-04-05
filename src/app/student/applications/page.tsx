"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Building2, Calendar, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ApplicationStatus = "applied" | "shortlisted" | "interviewing" | "rejected" | "hired"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
  applied: { label: "Applied", variant: "secondary" },
  shortlisted: { label: "Shortlisted", variant: "default" },
  interviewing: { label: "Interviewing", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
  hired: { label: "Hired", variant: "success" },
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/applications")
      const result = await res.json()
      if (res.ok) {
        setApplications(result.applications || [])
      } else {
        toast.error(result.error || "Failed to load tracking data")
      }
    } catch (err) {
      toast.error("Telemetry link failed")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const companyName = app.job?.company?.name || ""
    const role = app.job?.role || ""
    const matchesSearch =
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-secondary/20 text-secondary border-secondary/30"
      case "shortlisted":
        return "bg-primary/20 text-primary border-primary/30"
      case "interviewing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "hired":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      default:
        return "bg-muted text-muted-foreground border-white/5"
    }
  }

  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Active Applications</h1>
          <p className="text-gray-400 mt-1 font-light tracking-wide italic">Track your engagement across recruitment pipelines</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">Tracker Active</span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = applications.filter((app) => app.status === status).length
          return (
            <Card key={status} className="bg-white/5 border-white/10 hover:border-white/20 transition-all shadow-lg backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col items-center">
                <p className="text-3xl font-black text-white tracking-tighter">{count}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{config.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden">
        <CardContent className="p-4 bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by company identity or role..."
                className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-56 h-12 rounded-xl bg-white/5 border-white/10">
                <SelectValue placeholder="All Streams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing Dossiers</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="bg-white/5 border-white/10 border-dashed shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 opacity-30">
            <ClipboardList className="h-16 w-16 mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">No Active Engagement Detected</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all group shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black text-2xl group-hover:scale-110 transition-transform duration-500">
                      {app.job?.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-2">{app.job?.company?.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="text-sm font-bold text-gray-400">{app.job?.role}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                          <Calendar className="h-3 w-3" />
                          Logged: {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                    <div className="text-right hidden md:block mr-2">
                       <p className="text-sm font-bold text-gray-400">{app.job?.salaryCtc}</p>
                       <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">Payload Value</p>
                    </div>
                    <Badge className={cn("px-4 py-1.5 rounded-full border font-black text-[10px] uppercase tracking-[0.1em] shadow-sm", getStatusColor(app.status))}>
                      {statusConfig[app.status]?.label || app.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

