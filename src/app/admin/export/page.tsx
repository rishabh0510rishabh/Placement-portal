"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileSpreadsheet, FileText, Users, Building2, ClipboardList } from "lucide-react"
import { toast } from "sonner"

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
    description: "Export all job applications",
    icon: ClipboardList,
  },
  {
    id: "placements",
    label: "Placement Data",
    description: "Export placement statistics and results",
    icon: FileText,
  },
]

const programBranches = {
  "B.Tech": ["CSE", "CS", "AIML", "DS", "IT", "ECE", "EEE", "ME", "CE"],
  "M.Tech": ["ECE", "CSE"],
  "MBA": ["MBA"],
  "MCA": ["MCA"],
}

const branches = [
  "All Branches",
  ...Array.from(new Set(Object.values(programBranches).flat())).sort(),
]

export default function ExportPage() {
  const [selectedExports, setSelectedExports] = useState<string[]>([])
  const [format, setFormat] = useState("csv")
  const [branch, setBranch] = useState("All Branches")

  const toggleExport = (id: string) => {
    setSelectedExports(
      selectedExports.includes(id)
        ? selectedExports.filter((e) => e !== id)
        : [...selectedExports, id]
    )
  }

  const handleExport = async () => {
    toast.loading("Generating your export file...")
    try {
      // 1. Fetch live data based on selection
      const results = await Promise.all(
        selectedExports.map(async (id) => {
          const endpoint = id === "students" ? "/api/admin/students" : 
                           id === "companies" ? "/api/admin/companies" : 
                           id === "applications" ? "/api/admin/applications" : "/api/jobs"
          const res = await fetch(endpoint)
          const data = await res.json()
          return { id, data: data[id] || data.companies || data.students || data.jobs || data.applications || [] }
        })
      )

      // 2. Convert to CSV (Using first selection for example)
      if (results.length > 0) {
        const { id, data } = results[0]
        if (!data || data.length === 0) {
          toast.dismiss()
          toast.error(`No data found for ${id}`)
          return
        }

        const headers = Object.keys(data[0]).join(",")
        const rows = data.map((item: any) => 
          Object.values(item).map(val => `"${val}"`).join(",")
        ).join("\n")
        
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `rkgit_${id}_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.dismiss()
        toast.success(`${id.toUpperCase()} export complete!`)
      }
    } catch (err) {
      toast.dismiss()
      toast.error("Export failure. Please check network connection.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Export Data</h1>
        <p className="text-muted-foreground mt-1">Download placement data in various formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
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
                    selectedExports.includes(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  onClick={() => toggleExport(option.id)}
                >
                  <Checkbox
                    checked={selectedExports.includes(option.id)}
                    onCheckedChange={() => toggleExport(option.id)}
                  />
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

        {/* Export Settings */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Export Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>File Format</Label>
                <Select value={format} onValueChange={setFormat} disabled>
                  <SelectTrigger className="bg-secondary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CSV (.csv) - Optimized
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filter by Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full gap-2"
                disabled={selectedExports.length === 0}
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Selected Data
              </Button>

              {selectedExports.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Select at least one data type to export
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
