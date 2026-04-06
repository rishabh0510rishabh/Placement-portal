"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Building2, MapPin, IndianRupee, Calendar, Search, GraduationCap, Loader2, CheckCircle2, AlertCircle, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { JobListing, StudentProfile } from "@/types/database"

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [jobsRes, profileRes, appsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/profile"),
        fetch("/api/applications")
      ])
      
      const [jobsData, profileData, appsData] = await Promise.all([
        jobsRes.json(),
        profileRes.json(),
        appsRes.json()
      ])

      if (jobsRes.ok) setJobs(jobsData.jobs)
      if (profileRes.ok) setProfile(profileData.profile)
      if (appsRes.ok) {
        const appliedIds = appsData.applications.map((app: any) => app.jobId)
        setAppliedJobs(appliedIds)
      }
    } catch (err) {
      toast.error("Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }

  const isEligible = (job: JobListing) => {
    if (!profile) return false
    return (
      profile.cgpa >= job.minimumCgpa &&
      job.allowedBranches.includes(profile.branch) &&
      profile.activeBacklogs <= job.maximumBacklogs
    )
  }

  const handleApply = async () => {
    if (!selectedJob || !profile?.resumeUrl) {
      toast.error("Please upload your resume in your profile to apply")
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          resumeUrl: profile.resumeUrl
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Application for ${selectedJob.role} submitted!`)
        setAppliedJobs([...appliedJobs, selectedJob.id])
        setSelectedJob(null)
      } else {
        toast.error(data.error || "Submission failed")
      }
    } catch (err) {
      toast.error("Connection error")
    } finally {
      setIsApplying(false)
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || job.role === roleFilter
      const matchesLocation = locationFilter === "all" || job.location === locationFilter
      return matchesSearch && matchesRole && matchesLocation
    })
  }, [jobs, searchQuery, roleFilter, locationFilter])

  const uniqueRoles = useMemo(() => Array.from(new Set(jobs.map((job) => job.role))), [jobs])
  const uniqueLocations = useMemo(() => Array.from(new Set(jobs.map((job) => job.location))), [jobs])

  return (
    <div className="space-y-6 w-full pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Available Jobs</h1>
        <p className="text-muted-foreground mt-1 text-sm italic">Search and apply for new job openings</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies or job roles..."
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-20">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const eligible = isEligible(job)
            const hasApplied = appliedJobs.includes(job.id)

            return (
              <Card key={job.id} className="bg-card border-border hover:border-primary/20 transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-1 px-3 text-[10px] font-black uppercase tracking-tighter ${eligible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                   {eligible ? 'Eligible' : 'Not Eligible'}
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black border border-white/5 transition-transform group-hover:scale-110">
                      {job.company?.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">{job.company?.name}</CardTitle>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest">{job.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                       <IndianRupee className="h-3 w-3 text-[#22c55e]" /> {job.salaryCtc}
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin className="h-3 w-3 text-blue-500" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                       <GraduationCap className="h-3 w-3 text-amber-500" /> CGPA ≥ {job.minimumCgpa}
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-3 w-3 text-primary" /> Exp: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {hasApplied ? (
                    <Button disabled className="w-full rounded-xl h-11 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Application Verified
                    </Button>
                  ) : eligible ? (
                    <Button 
                      className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10"
                      onClick={() => setSelectedJob(job)}
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full rounded-xl h-11 border-white/5 bg-transparent">
                      <AlertCircle className="h-4 w-4 mr-2" /> Not Eligible
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!isLoading && filteredJobs.length === 0 && (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 opacity-40">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">No jobs found</p>
          </CardContent>
        </Card>
      )}

      {/* Apply Confirmation */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Application</DialogTitle>
            <DialogDescription>Submit your profile and resume to apply.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <Card className="bg-white/5 border-white/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Student Details</p>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Profile Verified</span>
                </div>
                <div>
                   <p className="font-bold text-white tracking-tight">{profile?.fullName}</p>
                   <p className="text-xs text-gray-500">{profile?.branch} | {profile?.rollNumber}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">Your Resume</p>
                   <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                         <Search className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-gray-300 truncate">{profile?.resumeFilename || 'default_resume.pdf'}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedJob(null)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleApply} disabled={isApplying} className="rounded-xl px-10 shadow-lg shadow-primary/20 bg-primary">
                {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
