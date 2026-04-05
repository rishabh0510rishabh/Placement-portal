"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Search, Plus, Pencil, Trash2, Loader2, Globe } from "lucide-react"
import { toast } from "sonner"
import { Company } from "@/types/database"

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    description: ""
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/companies")
      const data = await res.json()
      if (res.ok) {
        setCompanies(data.companies)
      } else {
        toast.error(data.error || "Failed to fetch companies")
      }
    } catch (err) {
      toast.error("Networking error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Company added successfully!")
        setIsDialogOpen(false)
        setFormData({ name: "", industry: "", website: "", description: "" })
        fetchCompanies()
      } else {
        toast.error(data.error || "Failed to add company")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCompanies = companies.filter((company) =>
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Company Profile</DialogTitle>
              <DialogDescription>Create a new database entry for a recruiting organization.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exact Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Google India"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry Sector</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Cloud Computing"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Official Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://google.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">About the Company</Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of the organization"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify and Add Company"}
                </Button>
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
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
               <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Website</TableHead>
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
                    <TableCell>
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                           <Globe className="h-3 w-3" /> Website
                        </a>
                      )}
                    </TableCell>
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
          )}
          {!isLoading && filteredCompanies.length === 0 && (
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
