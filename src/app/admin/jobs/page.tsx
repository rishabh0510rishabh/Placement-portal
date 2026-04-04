"use client"

import { useState } from "react"
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
import { Briefcase, Search, Plus, Pencil, Trash2 } from "lucide-react"

type Job = {
  id: string
  company: string
  role: string
  ctc: string
  location: string
  minCgpa: number
  branches: string[]
  maxBacklogs: number
  deadline: string
  applications: number
  status: "active" | "closed"
}

const mockJobs: Job[] = [
  {
    id: "1",
    company: "TCS",
    role: "Software Developer",
    ctc: "4.5 LPA",
    location: "Noida",
    minCgpa: 6.5,
    branches: ["CSE", "IT", "ECE"],
    maxBacklogs: 0,
    deadline: "Apr 15, 2026",
    applications: 156,
    status: "active",
  },
  {
    id: "2",
    company: "Infosys",
    role: "System Engineer",
    ctc: "3.8 LPA",
    location: "Bangalore",
    minCgpa: 6.0,
    branches: ["CSE", "IT", "ECE", "EE"],
    maxBacklogs: 1,
    deadline: "Apr 20, 2026",
    applications: 198,
    status: "active",
  },
  {
    id: "3",
    company: "Wipro",
    role: "Project Engineer",
    ctc: "4.0 LPA",
    location: "Hyderabad",
    minCgpa: 6.0,
    branches: ["CSE", "IT"],
    maxBacklogs: 0,
    deadline: "Apr 25, 2026",
    applications: 89,
    status: "active",
  },
]

const programBranches = {
  "B.Tech": [
    "Computer Science and Engineering",
    "Computer Science",
    "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
    "Computer Science and Engineering (Data Science)",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  "M.Tech": [
    "Electronics and Communication Engineering",
    "Computer Science and Engineering",
  ],
  "MBA": [
    "Master of Business Administration",
  ],
  "MCA": [
    "Master of Computer Application",
  ],
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    ctc: "",
    location: "",
    minCgpa: "",
    maxBacklogs: "",
    deadline: "",
    branches: [] as string[],
  })

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBranchToggle = (branch: string) => {
    setFormData({
      ...formData,
      branches: formData.branches.includes(branch)
        ? formData.branches.filter((b) => b !== branch)
        : [...formData.branches, branch],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Job data:", formData)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-1">Manage job listings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
              <DialogDescription>Fill in the details to create a new job posting.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="Enter job role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctc">CTC / Salary</Label>
                  <Input
                    id="ctc"
                    placeholder="e.g., 4.5 LPA"
                    value={formData.ctc}
                    onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter job location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minCgpa">Minimum CGPA</Label>
                  <Input
                    id="minCgpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g., 6.5"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBacklogs">Maximum Backlogs</Label>
                  <Input
                    id="maxBacklogs"
                    type="number"
                    min="0"
                    placeholder="e.g., 0"
                    value={formData.maxBacklogs}
                    onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter job description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Allowed Branches</Label>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {Object.entries(programBranches).map(([program, branches]) => (
                    <div key={program} className="space-y-2">
                      <p className="text-sm font-medium text-primary">{program}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3">
                        {branches.map((branch) => {
                          const branchId = `${program}-${branch}`
                          return (
                            <div key={branchId} className="flex items-center space-x-2">
                              <Checkbox
                                id={branchId}
                                checked={formData.branches.includes(branchId)}
                                onCheckedChange={() => handleBranchToggle(branchId)}
                              />
                              <Label htmlFor={branchId} className="font-normal cursor-pointer text-sm">
                                {branch}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Job Posting</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>CTC</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.company}</TableCell>
                  <TableCell>{job.role}</TableCell>
                  <TableCell>{job.ctc}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>{job.deadline}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        job.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {job.status === "active" ? "Active" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No jobs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
