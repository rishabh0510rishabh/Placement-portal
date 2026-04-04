"use client"

import { useState } from "react"
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
import { Building2, MapPin, IndianRupee, Calendar, Search, GraduationCap, AlertCircle } from "lucide-react"

type Job = {
  id: string
  company: string
  role: string
  description: string
  minCgpa: number
  branches: string[]
  maxBacklogs: number
  ctc: string
  location: string
  deadline: string
}

const mockJobs: Job[] = [
  {
    id: "1",
    company: "Tata Consultancy Services",
    role: "Software Developer",
    description: "Join TCS as a Software Developer and work on cutting-edge technologies. You will be part of a dynamic team building enterprise solutions.",
    minCgpa: 6.5,
    branches: ["CSE", "IT", "ECE"],
    maxBacklogs: 0,
    ctc: "4.5 LPA",
    location: "Noida",
    deadline: "Apr 15, 2026",
  },
  {
    id: "2",
    company: "Infosys",
    role: "System Engineer",
    description: "As a System Engineer at Infosys, you will be responsible for developing and maintaining software applications for global clients.",
    minCgpa: 6.0,
    branches: ["CSE", "IT", "ECE", "EE"],
    maxBacklogs: 1,
    ctc: "3.8 LPA",
    location: "Bangalore",
    deadline: "Apr 20, 2026",
  },
  {
    id: "3",
    company: "Wipro",
    role: "Project Engineer",
    description: "Work on diverse projects across various domains. Opportunity to grow and learn in a supportive environment.",
    minCgpa: 6.0,
    branches: ["CSE", "IT"],
    maxBacklogs: 0,
    ctc: "4.0 LPA",
    location: "Hyderabad",
    deadline: "Apr 25, 2026",
  },
  {
    id: "4",
    company: "HCL Technologies",
    role: "Graduate Engineer Trainee",
    description: "Join HCL as a GET and kickstart your career with one of India's leading IT companies.",
    minCgpa: 7.0,
    branches: ["CSE", "IT", "ECE", "ME"],
    maxBacklogs: 0,
    ctc: "4.25 LPA",
    location: "Chennai",
    deadline: "Apr 30, 2026",
  },
  {
    id: "5",
    company: "Cognizant",
    role: "Programmer Analyst",
    description: "Work on innovative projects and help clients transform their business through technology.",
    minCgpa: 6.5,
    branches: ["CSE", "IT"],
    maxBacklogs: 1,
    ctc: "4.0 LPA",
    location: "Pune",
    deadline: "May 5, 2026",
  },
]

// Mock student data
const studentData = {
  cgpa: 7.5,
  branch: "CSE",
  backlogs: 0,
  resumes: [
    { id: "1", name: "Software Developer Resume" },
    { id: "2", name: "General Resume" },
  ],
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedResume, setSelectedResume] = useState(studentData.resumes[0]?.id || "")
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])

  const isEligible = (job: Job) => {
    return (
      studentData.cgpa >= job.minCgpa &&
      job.branches.includes(studentData.branch) &&
      studentData.backlogs <= job.maxBacklogs
    )
  }

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || job.role === roleFilter
    const matchesLocation = locationFilter === "all" || job.location === locationFilter
    return matchesSearch && matchesRole && matchesLocation
  })

  const uniqueRoles = [...new Set(mockJobs.map((job) => job.role))]
  const uniqueLocations = [...new Set(mockJobs.map((job) => job.location))]

  const handleApply = () => {
    if (selectedJob && selectedResume) {
      setAppliedJobs([...appliedJobs, selectedJob.id])
      setSelectedJob(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Job Listings</h1>
        <p className="text-muted-foreground mt-1">Browse and apply for available positions</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or role..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const eligible = isEligible(job)
          const hasApplied = appliedJobs.includes(job.id)

          return (
            <Card key={job.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-secondary shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.company}</CardTitle>
                      <p className="text-sm text-primary">{job.role}</p>
                    </div>
                  </div>
                  <Badge variant={eligible ? "default" : "secondary"}>
                    {eligible ? "Eligible" : "Not Eligible"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    {job.ctc}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Min CGPA: {job.minCgpa}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {job.deadline}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.branches.map((branch) => (
                    <Badge key={branch} variant="outline" className="text-xs">
                      {branch}
                    </Badge>
                  ))}
                </div>

                {hasApplied ? (
                  <Button disabled className="w-full">
                    Applied
                  </Button>
                ) : eligible ? (
                  <Button className="w-full" onClick={() => setSelectedJob(job)}>
                    Apply Now
                  </Button>
                ) : (
                  <Button variant="secondary" disabled className="w-full">
                    Not Eligible
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No jobs found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Apply Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.role} at {selectedJob?.company}</DialogTitle>
            <DialogDescription>Select a resume and submit your application.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-medium text-foreground mb-2">Job Details</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>CTC: {selectedJob?.ctc}</p>
                <p>Location: {selectedJob?.location}</p>
                <p>Deadline: {selectedJob?.deadline}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Select Resume to Submit</Label>
              <RadioGroup value={selectedResume} onValueChange={setSelectedResume}>
                {studentData.resumes.map((resume) => (
                  <div key={resume.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={resume.id} id={resume.id} />
                    <Label htmlFor={resume.id} className="font-normal cursor-pointer">
                      {resume.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
