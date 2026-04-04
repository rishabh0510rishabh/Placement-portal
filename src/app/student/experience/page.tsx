"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Plus, Pencil, Trash2, Building2 } from "lucide-react"

type Experience = {
  id: string
  company: string
  role: string
  duration: string
  description: string
}

const initialExperiences: Experience[] = [
  {
    id: "1",
    company: "Tech Corp",
    role: "Software Development Intern",
    duration: "Jun 2025 - Aug 2025",
    description: "Developed web applications using React and Node.js. Collaborated with the team on agile projects.",
  },
]

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  })

  const resetForm = () => {
    setFormData({ company: "", role: "", duration: "", description: "" })
    setEditingExperience(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const experienceData: Experience = {
      id: editingExperience?.id || Date.now().toString(),
      ...formData,
    }

    if (editingExperience) {
      setExperiences(experiences.map((exp) => (exp.id === editingExperience.id ? experienceData : exp)))
    } else {
      setExperiences([...experiences, experienceData])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company,
      role: experience.role,
      duration: experience.duration,
      description: experience.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Work Experience</h1>
          <p className="text-muted-foreground mt-1">Add your internships and work experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add Work Experience"}
              </DialogTitle>
              <DialogDescription>
                {editingExperience ? "Update your work experience details." : "Add details about your internship or work experience."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., Jun 2025 - Aug 2025"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your responsibilities and achievements"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExperience ? "Update Experience" : "Add Experience"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No work experience added yet</p>
            <p className="text-sm text-muted-foreground">This section is optional</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-lg bg-secondary shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{experience.role}</h3>
                      <p className="text-sm text-primary">{experience.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">{experience.duration}</p>
                      <p className="text-sm text-muted-foreground mt-3">{experience.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(experience.id)}
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
    </div>
  )
}
