"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, FileSpreadsheet, FileText, Users, Building2, ClipboardList, X } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const exportOptions = [
  {
    id: "students",
    label: "Student Data",
    description: "Export all registered student information",
    icon: Users,
  },
  {
    id: "companies",
    label: "Company Data",
    description: "Export all registered company information",
    icon: Building2,
  },
  {
    id: "applications",
    label: "Application Data",
    description: "Export all job applications with student & company details",
    icon: ClipboardList,
  },
  {
    id: "placements",
    label: "Placement Data",
    description: "Export job listings with company and eligibility info",
    icon: FileText,
  },
]

// --- Data shape definitions for each export type ---
type ExportConfig = {
  headers: string[]
  extractRow: (item: any) => string[]
}

// Skills can be an object like {tools: [...], databases: [...], ...} or an array
function flattenSkills(skills: any): string {
  if (!skills) return ""
  if (typeof skills === "string") return skills
  if (Array.isArray(skills)) return skills.join("; ")
  if (typeof skills === "object") {
    return Object.values(skills)
      .flat()
      .filter((v: any) => v && typeof v === "string")
      .join("; ")
  }
  return String(skills)
}

function getExportConfig(type: string): ExportConfig {
  switch (type) {
    case "students":
      return {
        headers: ["Full Name", "Email", "Roll Number", "College ID", "Branch", "Section", "Semester", "CGPA", "Active Backlogs", "Phone", "LinkedIn", "GitHub", "Skills"],
        extractRow: (s: any) => [
          s.fullName || "",
          s.email || "",
          s.rollNumber || "",
          s.collegeId || "",
          s.branch || "",
          s.section || "",
          String(s.currentSemester ?? ""),
          String(s.cgpa ?? ""),
          String(s.activeBacklogs ?? ""),
          s.phoneNumber || "",
          s.linkedin || "",
          s.github || "",
          flattenSkills(s.skills),
        ],
      }
    case "companies":
      return {
        headers: ["Company Name", "Industry", "Website", "Description", "Status"],
        extractRow: (c: any) => [
          c.name || "",
          c.industry || "",
          c.website || "",
          c.description || "",
          c.status || "",
        ],
      }
    case "applications":
      return {
        headers: ["Student Name", "Student Email", "Company", "Job Role", "CGPA", "Resume / Profile", "Status", "Applied Date"],
        extractRow: (app: any) => [
          app.student?.fullName || "",
          app.student?.email || "",
          app.job?.company?.name || "",
          app.job?.role || "",
          String(app.student?.cgpa ?? ""),
          app.student?.resumeUrl || app.student?.linkedin || app.student?.github || "",
          app.status || "",
          app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "",
        ],
      }
    case "placements":
      return {
        headers: ["Company", "Job Role", "Category", "CTC/Salary", "Location", "Min CGPA", "Max Backlogs", "Allowed Branches", "Required Skills", "Deadline", "Status"],
        extractRow: (job: any) => [
          job.company?.name || "",
          job.role || "",
          job.category || "",
          job.salaryCtc || "",
          job.location || "",
          String(job.minimumCgpa ?? ""),
          String(job.maximumBacklogs ?? ""),
          Array.isArray(job.allowedBranches) ? job.allowedBranches.join("; ") : (job.allowedBranches || ""),
          Array.isArray(job.requiredSkills) ? job.requiredSkills.join("; ") : (job.requiredSkills || ""),
          job.deadline ? new Date(job.deadline).toLocaleDateString() : "",
          job.status || "",
        ],
      }
    default:
      return { headers: [], extractRow: () => [] }
  }
}

function getEndpoint(type: string): string {
  switch (type) {
    case "students": return "/api/admin/students"
    case "companies": return "/api/admin/companies"
    case "applications": return "/api/admin/applications"
    case "placements": return "/api/jobs"
    default: return ""
  }
}

function extractItems(type: string, data: any): any[] {
  return data[type] || data.companies || data.students || data.jobs || data.applications || []
}

export default function ExportPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([])
  const [previewRows, setPreviewRows] = useState<string[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  // --- Preview: Fetch data and show in table ---
  const handlePreview = async () => {
    if (!selectedType) {
      toast.error("Please select a data type to preview")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(getEndpoint(selectedType))
      if (!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json()
      const items = extractItems(selectedType, data)

      if (!items || items.length === 0) {
        toast.error(`No data found for ${selectedType}`)
        setIsLoading(false)
        return
      }

      const config = getExportConfig(selectedType)
      setPreviewHeaders(config.headers)
      setPreviewRows(items.map(config.extractRow))
      setIsPreviewing(true)
      toast.success(`Loaded ${items.length} records`)
    } catch (err) {
      toast.error("Failed to fetch data. Check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Download as CSV ---
  const handleDownloadCSV = () => {
    if (previewHeaders.length === 0 || previewRows.length === 0) return

    const escapeCSV = (val: string): string => {
      const escaped = val.replace(/"/g, '""')
      return `"${escaped}"`
    }

    const csvString =
      previewHeaders.map(escapeCSV).join(",") +
      "\n" +
      previewRows.map((row) => row.map(escapeCSV).join(",")).join("\n")

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rkgit_${selectedType}_export_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("CSV downloaded successfully!")
  }

  // --- Download as PDF ---
  const handleDownloadPDF = async () => {
    if (previewHeaders.length === 0 || previewRows.length === 0) return

    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      // Title
      const title = exportOptions.find((o) => o.id === selectedType)?.label || "Export"
      doc.setFontSize(16)
      doc.text(`RKGIT Placement Portal — ${title}`, 14, 15)
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 21)

      // Table
      autoTable(doc, {
        startY: 26,
        head: [previewHeaders],
        body: previewRows,
        theme: "grid",
        headStyles: {
          fillColor: [30, 30, 30],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 6.5,
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 10, right: 10 },
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
        },
        columnStyles: previewHeaders.reduce((acc: any, _: string, i: number) => {
          acc[i] = { cellWidth: "auto" }
          return acc
        }, {}),
      })

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.text(
          `Page ${i} of ${pageCount} — RKGIT Placement Portal`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 7,
          { align: "center" }
        )
      }

      doc.save(`rkgit_${selectedType}_export_${new Date().toISOString().split("T")[0]}.pdf`)
      toast.success("PDF downloaded successfully!")
    } catch (err) {
      console.error("PDF generation error:", err)
      toast.error("Failed to generate PDF. Please try CSV instead.")
    }
  }

  const clearPreview = () => {
    setIsPreviewing(false)
    setPreviewHeaders([])
    setPreviewRows([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-1">Preview and download placement data in CSV or PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Type Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Select Data to Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedType === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  onClick={() => {
                    setSelectedType(option.id)
                    if (isPreviewing) clearPreview()
                  }}
                >
                  <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedType === option.id ? "border-primary" : "border-muted-foreground/40"
                  }`}>
                    {selectedType === option.id && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-secondary shrink-0">
                    <option.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Button */}
              <Button
                className="w-full gap-2"
                variant="outline"
                disabled={!selectedType || isLoading}
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4" />
                {isLoading ? "Loading..." : "Preview Data"}
              </Button>

              {/* Download Buttons — only visible after preview */}
              {isPreviewing && (
                <>
                  <div className="border-t border-border pt-4">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Download As</Label>
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={handleDownloadCSV}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Download CSV
                  </Button>

                  <Button
                    className="w-full gap-2"
                    variant="secondary"
                    onClick={handleDownloadPDF}
                  >
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {previewRows.length} records ready for download
                  </p>
                </>
              )}

              {!selectedType && (
                <p className="text-sm text-muted-foreground text-center">
                  Select a data type to get started
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Preview Table */}
      {isPreviewing && (
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Data Preview — {exportOptions.find((o) => o.id === selectedType)?.label}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {previewRows.length} record{previewRows.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearPreview}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full" style={{ maxHeight: "480px" }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold text-muted-foreground w-12">#</TableHead>
                      {previewHeaders.map((header, i) => (
                        <TableHead key={i} className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, rowIdx) => (
                      <TableRow key={rowIdx} className="hover:bg-secondary/40">
                        <TableCell className="text-xs text-muted-foreground font-mono">{rowIdx + 1}</TableCell>
                        {row.map((cell, cellIdx) => (
                          <TableCell key={cellIdx} className="text-sm whitespace-nowrap max-w-[250px] truncate" title={cell}>
                            {cell || <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
