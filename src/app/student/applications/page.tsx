"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Building2, Calendar, Search } from "lucide-react"

type ApplicationStatus = "applied" | "under_review" | "shortlisted" | "rejected" | "selected"

type Application = {
  id: string
  company: string
  role: string
  appliedDate: string
  status: ApplicationStatus
}

const mockApplications: Application[] = [
  {
    id: "1",
    company: "Tata Consultancy Services",
    role: "Software Developer",
    appliedDate: "Apr 1, 2026",
    status: "shortlisted",
  },
  {
    id: "2",
    company: "Infosys",
    role: "System Engineer",
    appliedDate: "Mar 28, 2026",
    status: "under_review",
  },
  {
    id: "3",
    company: "Wipro",
    role: "Project Engineer",
    appliedDate: "Mar 25, 2026",
    status: "applied",
  },
  {
    id: "4",
    company: "Tech Mahindra",
    role: "Software Engineer",
    appliedDate: "Mar 20, 2026",
    status: "rejected",
  },
  {
    id: "5",
    company: "HCL Technologies",
    role: "Graduate Engineer Trainee",
    appliedDate: "Mar 15, 2026",
    status: "selected",
  },
]

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applied: { label: "Applied", variant: "secondary" },
  under_review: { label: "Under Review", variant: "outline" },
  shortlisted: { label: "Shortlisted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  selected: { label: "Selected", variant: "default" },
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return "bg-muted text-muted-foreground"
      case "under_review":
        return "bg-warning/10 text-warning border-warning"
      case "shortlisted":
        return "bg-primary/10 text-primary border-primary"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive"
      case "selected":
        return "bg-success/10 text-success border-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <p className="text-muted-foreground mt-1">Track your job applications</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = mockApplications.filter((app) => app.status === status).length
          return (
            <Card key={status} className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{config.label}</p>
              </CardContent>
            </Card>
          )
        })}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
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
      {filteredApplications.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{application.company}</h3>
                      <p className="text-sm text-muted-foreground">{application.role}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        Applied: {application.appliedDate}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {statusConfig[application.status].label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
