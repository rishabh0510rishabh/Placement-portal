"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Briefcase, Search, Plus, Pencil, Trash2, Loader2, MapPin, IndianRupee, Calendar } from "lucide-react"
import { toast } from "sonner"
import { JobListing, Company, Branch } from "@/types/database"

const branchOptions = [
  { label: "CSE", value: "CSE" },
  { label: "CSE (AI&ML)", value: "CSE_AI" },
  { label: "CSE (DS)", value: "CSE_DS" },
  { label: "Information Technology", value: "IT" },
  { label: "ECE", value: "ECE" },
  { label: "Electrical Engineering", value: "EE" },
  { label: "Mechanical Engineering", value: "ME" },
  { label: "Civil Engineering", value: "CE" },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [formData, setFormData] = useState({
    companyId: "",
    role: "",
    category: "Full Time",
    description: "",
    salaryCtc: "",
    location: "",
    minimumCgpa: "",
    maximumBacklogs: "0",
    deadline: "",
    allowedBranches: [] as string[],
    requiredSkills: [] as string[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/admin/companies")
      ])
      const [jobsData, companiesData] = await Promise.all([
        jobsRes.json(),
        companiesRes.json()
      ])
      
      if (jobsRes.ok) setJobs(jobsData.jobs)
      if (companiesRes.ok) setCompanies(companiesData.companies)
    } catch (err) {
      toast.error("Failed to sync recruitment data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBranchToggle = (branch: string) => {
    setFormData({
      ...formData,
      allowedBranches: formData.allowedBranches.includes(branch)
        ? formData.allowedBranches.filter((b) => b !== branch)
        : [...formData.allowedBranches, branch],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!formData.companyId) {
      toast.error("Please select a recruiting company")
      setIsSubmitting(false)
      return
    }

    if (formData.allowedBranches.length === 0) {
      toast.error("Please select at least one eligible branch")
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        ...formData,
        minimumCgpa: parseFloat(formData.minimumCgpa),
        maximumBacklogs: parseInt(formData.maximumBacklogs),
        requiredSkills: [] // Optional for now
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Job posting live! Broadcast notifications sent to students.")
        setIsDialogOpen(false)
        setFormData({
          companyId: "", role: "", category: "Full Time",
          description: "", salaryCtc: "", location: "",
          minimumCgpa: "", maximumBacklogs: "0", deadline: "",
          allowedBranches: [], requiredSkills: []
        })
        fetchData()
      } else {
        toast.error(data.error || "Failed to broadcast job")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Recruitment Terminal</h1>
          <p className="text-muted-foreground mt-1 text-sm italic">Manage high-precision job opportunity broadcasting</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10">
              <Plus className="h-4 w-4" />
              Broadcast Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">New Recruitment Opportunity</DialogTitle>
              <DialogDescription>Define your role and eligibility criteria for campus distribution.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyId">Recruiting Organization</Label>
                  <Select 
                    value={formData.companyId} 
                    onValueChange={(val) => setFormData({...formData, companyId: val})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-11 transition-all focus:ring-1 focus:ring-primary h-12">
                      <SelectValue placeholder="Select Database Entry" />
                    </SelectTrigger>
                    <SelectContent>
                       {companies.map(c => (
                         <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                       ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role Title</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Software Engineering Trainee"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryCtc">Compensation (CTC)</Label>
                  <Input
                    id="salaryCtc"
                    placeholder="e.g., 6.5 LPA"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.salaryCtc}
                    onChange={(e) => setFormData({ ...formData, salaryCtc: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Geographic Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote / Noida"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumCgpa">C.G.P.A Cut-off</Label>
                  <Input
                    id="minimumCgpa"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 6.5"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.minimumCgpa}
                    onChange={(e) => setFormData({ ...formData, minimumCgpa: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximumBacklogs">Allowed Active Backlogs</Label>
                  <Input
                    id="maximumBacklogs"
                    type="number"
                    min="0"
                    placeholder="e.g., 0"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.maximumBacklogs}
                    onChange={(e) => setFormData({ ...formData, maximumBacklogs: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deadline">Application Expiry (Deadline)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="bg-white/5 border-white/10 rounded-xl transition-all focus:ring-1 focus:ring-primary h-12 px-5"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Strategic Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed role requirements and company highlights"
                  className="bg-white/5 border-white/10 rounded-xl min-h-[120px] transition-all focus:ring-1 focus:ring-primary p-4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-xs uppercase font-black tracking-widest text-primary">Academic Eligibility Gates</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  {branchOptions.map((branch) => (
                    <div key={branch.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={branch.value}
                        checked={formData.allowedBranches.includes(branch.value)}
                        onCheckedChange={() => handleBranchToggle(branch.value)}
                        className="rounded-md border-white/20 data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor={branch.value} className="font-bold cursor-pointer text-xs text-gray-400 select-none">
                        {branch.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl px-8 hover:bg-white/5">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl px-10 shadow-lg shadow-primary/20">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Broadcast"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-white/[0.02]">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Audit recruitment pipeline..."
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6">Organization</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6">Role / Title</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-center">Eligibility</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-right">Compensation</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-right">Gate Status</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-500 py-6 text-right px-6">Terminal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-white/[0.02] transition-colors border-white/5">
                      <TableCell className="py-5">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                             {job.company?.name.charAt(0)}
                           </div>
                           <span className="font-bold text-white tracking-tight">{job.company?.name}</span>
                         </div>
                      </TableCell>
                      <TableCell className="py-5 font-bold text-gray-300">{job.role}</TableCell>
                      <TableCell className="py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">CGPA ≥ {job.minimumCgpa}</span>
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{job.allowedBranches.length} Gates Open</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-right font-black text-[#22c55e]">{job.salaryCtc}</TableCell>
                      <TableCell className="py-5 text-right">
                        <Badge
                          className={
                            job.status === "active"
                              ? "bg-success/10 text-success border-success/20 rounded-full font-black text-[9px] uppercase tracking-widest"
                              : "bg-muted text-muted-foreground border-white/10 rounded-full font-black text-[9px] uppercase tracking-widest"
                          }
                        >
                          {job.status === "active" ? "Broadcasting" : "Offline"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
                            <Pencil className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 border border-transparent hover:border-destructive/20 text-destructive/70">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!isLoading && filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">No Opportunity Detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
