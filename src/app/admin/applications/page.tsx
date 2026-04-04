"use client"

import { useState } from "react"
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
import { ClipboardList, Search, MoreHorizontal, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

type ApplicationStatus = "applied" | "under_review" | "shortlisted" | "rejected" | "selected"

type Application = {
  id: string
  studentName: string
  studentEmail: string
  company: string
  role: string
  appliedDate: string
  cgpa: number
  status: ApplicationStatus
}

const mockApplications: Application[] = [
  {
    id: "1",
    studentName: "Rahul Kumar",
    studentEmail: "rahul.kumar@rkgit.edu.in",
    company: "TCS",
    role: "Software Developer",
    appliedDate: "Apr 1, 2026",
    cgpa: 8.5,
    status: "shortlisted",
  },
  {
    id: "2",
    studentName: "Priya Singh",
    studentEmail: "priya.singh@rkgit.edu.in",
    company: "Infosys",
    role: "System Engineer",
    appliedDate: "Mar 28, 2026",
    cgpa: 9.0,
    status: "selected",
  },
  {
    id: "3",
    studentName: "Amit Sharma",
    studentEmail: "amit.sharma@rkgit.edu.in",
    company: "Wipro",
    role: "Project Engineer",
    appliedDate: "Mar 25, 2026",
    cgpa: 7.8,
    status: "under_review",
  },
  {
    id: "4",
    studentName: "Sneha Gupta",
    studentEmail: "sneha.gupta@rkgit.edu.in",
    company: "TCS",
    role: "Software Developer",
    appliedDate: "Mar 20, 2026",
    cgpa: 8.2,
    status: "applied",
  },
  {
    id: "5",
    studentName: "Vikram Patel",
    studentEmail: "vikram.patel@rkgit.edu.in",
    company: "HCL",
    role: "GET",
    appliedDate: "Mar 15, 2026",
    cgpa: 8.8,
    status: "rejected",
  },
]

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  applied: { label: "Applied", color: "bg-muted text-muted-foreground" },
  under_review: { label: "Under Review", color: "bg-warning/10 text-warning" },
  shortlisted: { label: "Shortlisted", color: "bg-primary/10 text-primary" },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive" },
  selected: { label: "Selected", color: "bg-success/10 text-success" },
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [applications, setApplications] = useState(mockApplications)

  const uniqueCompanies = [...new Set(mockApplications.map((app) => app.company))]

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesCompany = companyFilter === "all" || app.company === companyFilter
    return matchesSearch && matchesStatus && matchesCompany
  })

  const updateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <p className="text-muted-foreground mt-1">Manage student applications</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
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

      {/* Applications Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.studentName}</p>
                      <p className="text-sm text-muted-foreground">{app.studentEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{app.company}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>{app.cgpa.toFixed(1)}</TableCell>
                  <TableCell>{app.appliedDate}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[app.status].color}>
                      {statusConfig[app.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, "under_review")}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark Under Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, "shortlisted")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Shortlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, "selected")}>
                          <CheckCircle className="h-4 w-4 mr-2 text-success" />
                          Select
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="text-destructive focus:text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No applications found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
