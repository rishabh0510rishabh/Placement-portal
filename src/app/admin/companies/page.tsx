"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Building2, Search, Plus, Pencil, Trash2 } from "lucide-react"

type Company = {
  id: string
  name: string
  industry: string
  activeJobs: number
  totalHired: number
  status: "active" | "inactive"
}

const mockCompanies: Company[] = [
  { id: "1", name: "Tata Consultancy Services", industry: "IT Services", activeJobs: 3, totalHired: 45, status: "active" },
  { id: "2", name: "Infosys", industry: "IT Services", activeJobs: 2, totalHired: 38, status: "active" },
  { id: "3", name: "Wipro", industry: "IT Services", activeJobs: 2, totalHired: 28, status: "active" },
  { id: "4", name: "HCL Technologies", industry: "IT Services", activeJobs: 1, totalHired: 22, status: "active" },
  { id: "5", name: "Cognizant", industry: "IT Consulting", activeJobs: 1, totalHired: 19, status: "active" },
  { id: "6", name: "Tech Mahindra", industry: "IT Services", activeJobs: 0, totalHired: 15, status: "inactive" },
]

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage recruiting companies</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead>Total Hired</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.activeJobs}</TableCell>
                  <TableCell>{company.totalHired}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        company.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {company.status === "active" ? "Active" : "Inactive"}
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
          {filteredCompanies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No companies found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
