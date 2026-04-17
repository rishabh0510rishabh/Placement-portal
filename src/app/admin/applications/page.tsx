"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClipboardList, Search, MoreHorizontal, FileText, CheckCircle, XCircle, Clock, Loader2, User, Building2, Filter } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  applied: { label: "Applied", color: "bg-secondary/20 text-secondary border-secondary/30", icon: Clock },
  shortlisted: { label: "Shortlisted", color: "bg-primary/20 text-primary border-primary/30", icon: CheckCircle },
  interviewing: { label: "Interviewing", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: MoreHorizontal },
  rejected: { label: "Rejected", color: "bg-destructive/20 text-destructive border-destructive/30", icon: XCircle },
  hired: { label: "Hired", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
}

const CGPA_RANGES = [
  { label: "All CGPAs", value: "all" },
  { label: "≥ 9.0", value: "9" },
  { label: "≥ 8.0", value: "8" },
  { label: "≥ 7.0", value: "7" },
  { label: "≥ 6.0", value: "6" },
  { label: "< 6.0", value: "below6" },
]

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [skillFilter, setSkillFilter] = useState("all")
  const [cgpaFilter, setCgpaFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/applications")
      const result = await res.json()
      if (res.ok) {
        setApplications(result.applications || [])
      } else {
        toast.error(result.error || "Connection error")
      }
    } catch (err) {
      toast.error("Connection error")
    } finally {
      setIsLoading(false)
    }
  }

  const uniqueCompanies = useMemo(
    () => Array.from(new Set(applications.map((app) => app.job?.company?.name))).filter(Boolean) as string[],
    [applications]
  )

  // Flatten all student skills across all applications (skills is a JSON object keyed by category)
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>()
    applications.forEach((app) => {
      const studentSkills = app.student?.skills || {}
      Object.values(studentSkills).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((s: string) => skillSet.add(s))
      })
    })
    return Array.from(skillSet).sort()
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const studentName = app.student?.fullName || ""
      const studentEmail = app.student?.email || ""
      const companyName = app.job?.company?.name || ""
      const studentSkills: string[] = Object.values(app.student?.skills || {}).flat() as string[]
      const cgpa: number = app.job?.minimumCgpa ?? 0

      const matchesSearch =
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studentEmail.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesCompany = companyFilter === "all" || companyName === companyFilter

      const matchesSkill =
        skillFilter === "all" ||
        studentSkills.some((s) => s.toLowerCase() === skillFilter.toLowerCase())

      const matchesCgpa =
        cgpaFilter === "all"
          ? true
          : cgpaFilter === "below6"
          ? cgpa < 6
          : cgpa >= Number(cgpaFilter)

      return matchesSearch && matchesStatus && matchesCompany && matchesSkill && matchesCgpa
    })
  }, [applications, searchQuery, statusFilter, companyFilter, skillFilter, cgpaFilter])

  const updateStatus = async (id: string, newStatus: string) => {
    const originalStatus = applications.find(a => a.id === id)?.status
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(`Candidate status transitioned to ${newStatus.toUpperCase()}`)
    } catch (err) {
      toast.error("Failed to update status. Reverting...")
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: originalStatus } : a))
    }
  }

  return (
    <div className="space-y-6 md:space-y-10 w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Job Applications</h1>
          <p className="text-gray-400 mt-1 font-light tracking-wide italic">Manage student applications and tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">System Ready</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden backdrop-blur-sm">
        <CardContent className="p-4 bg-white/[0.02]">
          <div className="flex flex-col gap-4">
            {/* Row 1: Search + Company + Status */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by student name or email..."
                  className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl bg-white/5 border-white/10">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {uniqueCompanies.map((company) => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl bg-white/5 border-white/10">
                    <SelectValue placeholder="Application Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Skill Filter + CGPA Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-white/5 border-white/10">
                    <SelectValue placeholder="Filter by Required Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
                <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl bg-white/5 border-white/10">
                  <SelectValue placeholder="Filter by Min. CGPA" />
                </SelectTrigger>
                <SelectContent>
                  {CGPA_RANGES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Loading applications...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.01]">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6">Student Name</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6">Job Applied For</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6">Student Skills</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-center">Min. CGPA</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-center">Applied Date</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-center">Status</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-right px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => {
                  const studentSkills: string[] = Object.values(app.student?.skills || {}).flat() as string[]
                  return (
                    <TableRow key={app.id} className="hover:bg-white/[0.02] border-white/5 transition-colors">
                      <TableCell className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 italic shrink-0">
                            {app.student?.fullName?.charAt(0) || <User className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-white tracking-tight">{app.student?.fullName}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{app.student?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <Building2 className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm tracking-tight">{app.job?.company?.name}</p>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{app.job?.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 max-w-[180px]">
                        {(() => {
                          const studentSkills: string[] = Object.values(app.student?.skills || {}).flat() as string[]
                          return (
                            <div className="flex flex-wrap gap-1">
                              {studentSkills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider whitespace-nowrap"
                                >
                                  {skill}
                                </span>
                              ))}
                              {studentSkills.length > 3 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10">
                                  +{studentSkills.length - 3}
                                </span>
                              )}
                              {studentSkills.length === 0 && (
                                <span className="text-[10px] text-gray-600">—</span>
                              )}
                            </div>
                          )
                        })()}
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        {app.job?.minimumCgpa != null ? (
                          <span className="text-xs font-bold text-amber-400">≥ {app.job.minimumCgpa}</span>
                        ) : (
                          <span className="text-[10px] text-gray-600">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-5 text-center px-4 font-mono text-xs text-gray-400">
                        {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <Badge className={cn("px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border shadow-sm", statusConfig[app.status]?.color)}>
                          {statusConfig[app.status]?.label || app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 rounded-xl">
                            <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider h-11 focus:bg-white/5 cursor-pointer" onClick={() => window.open(app.resumeUrl, '_blank')}>
                              <FileText className="h-4 w-4 mr-3 text-blue-500" />
                              Audit Resume
                            </DropdownMenuItem>
                            <div className="h-px bg-white/5 my-1" />
                            <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider h-11 focus:bg-white/5 cursor-pointer" onClick={() => updateStatus(app.id, "shortlisted")}>
                              <CheckCircle className="h-4 w-4 mr-3 text-primary" />
                              Shortlist Candidate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider h-11 focus:bg-white/5 cursor-pointer" onClick={() => updateStatus(app.id, "interviewing")}>
                              <MoreHorizontal className="h-4 w-4 mr-3 text-blue-400" />
                              Move to Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider h-11 focus:bg-white/5 cursor-pointer" onClick={() => updateStatus(app.id, "hired")}>
                              <CheckCircle className="h-4 w-4 mr-3 text-emerald-500" />
                              Hire Candidate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(app.id, "rejected")}
                              className="text-[11px] font-bold uppercase tracking-wider h-11 focus:bg-destructive/10 text-destructive/80 focus:text-destructive cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 mr-3" />
                              Reject Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
          {!isLoading && filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
              <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">No applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
