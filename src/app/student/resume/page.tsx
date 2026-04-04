"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Plus, ExternalLink, Trash2, CheckCircle2 } from "lucide-react"

type Resume = {
  id: string
  name: string
  link: string
  isDefault: boolean
}

const initialResumes: Resume[] = [
  {
    id: "1",
    name: "Software Developer Resume",
    link: "https://drive.google.com/file/d/example1",
    isDefault: true,
  },
  {
    id: "2",
    name: "General Resume",
    link: "https://drive.google.com/file/d/example2",
    isDefault: false,
  },
]

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (resumes.length >= 5) {
      alert("You can only store up to 5 resumes")
      return
    }

    const newResume: Resume = {
      id: Date.now().toString(),
      name: formData.name,
      link: formData.link,
      isDefault: resumes.length === 0,
    }

    setResumes([...resumes, newResume])
    setFormData({ name: "", link: "" })
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    const updatedResumes = resumes.filter((r) => r.id !== id)
    // If we deleted the default resume, set the first one as default
    if (updatedResumes.length > 0 && !updatedResumes.some((r) => r.isDefault)) {
      updatedResumes[0].isDefault = true
    }
    setResumes(updatedResumes)
  }

  const handleSetDefault = (id: string) => {
    setResumes(
      resumes.map((r) => ({
        ...r,
        isDefault: r.id === id,
      }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Resume Management</h1>
          <p className="text-muted-foreground mt-1">Manage your resumes (max 5)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={resumes.length >= 5}>
              <Plus className="h-4 w-4" />
              Add Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Resume</DialogTitle>
              <DialogDescription>Add a link to your resume stored on Google Drive or Dropbox.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Resume Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Software Developer Resume"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Resume Link</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="Google Drive or Dropbox link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload your resume to Google Drive or Dropbox and paste the sharing link
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Resume</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-secondary/30 border-border">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            You can store up to 5 resumes. When applying for jobs, you can choose which resume to submit.
            The default resume will be pre-selected when applying.
          </p>
        </CardContent>
      </Card>

      {/* Resumes List */}
      {resumes.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resumes added yet</p>
            <p className="text-sm text-muted-foreground">Click the button above to add your first resume</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{resume.name}</h3>
                        {resume.isDefault && (
                          <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <a
                        href={resume.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Resume
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!resume.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(resume.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(resume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        {resumes.length}/5 resumes stored
      </p>
    </div>
  )
}
