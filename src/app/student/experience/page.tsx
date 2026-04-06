"use client"

import { useState, useEffect } from "react"
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
import { Briefcase, Plus, Pencil, Trash2, Building2, Loader2, Calendar } from "lucide-react"

import { toast } from "sonner"

type Experience = {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  isCurrentRole: boolean
  description: string
}

export default function ExperiencePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    isCurrentRole: false,
    description: "",
  })

  // Load experience from Supabase
  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile?.experience) {
          // Format dates for input fields
          const formatted = data.profile.experience.map((exp: any) => ({
            ...exp,
            startDate: exp.startDate?.split('T')[0] || "",
            endDate: exp.endDate?.split('T')[0] || "",
          }));
          setExperiences(formatted);
        }
      } catch (err) {
        console.error("Load experience error:", err);
        toast.error("Cloud history sync failure");
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  const resetForm = () => {
    setFormData({ company: "", role: "", startDate: "", endDate: "", isCurrentRole: false, description: "" })
    setEditingExperience(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }

    setSaving(true)

    const experienceData = {
      id: editingExperience?.id,
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.isCurrentRole ? null : (formData.endDate ? new Date(formData.endDate).toISOString() : null),
    }

    try {
      const res = await fetch('/api/profile/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceData),
      });

      if (res.ok) {
        const result = await res.json();
        // Re-format for local state
        const savedExp = {
          ...result.experience,
          startDate: result.experience.startDate?.split('T')[0],
          endDate: result.experience.endDate?.split('T')[0],
        };

        if (editingExperience) {
          setExperiences(experiences.map((exp) => (exp.id === editingExperience.id ? savedExp : exp)))
          toast.success("Experience record updated")
        } else {
          setExperiences([...experiences, savedExp])
          toast.success("New professional record archived")
        }
        resetForm()
        setIsDialogOpen(false)
      } else {
        const err = await res.json()
        toast.error(err.error || "Professional history update failure")
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Networking communication failure")
    } finally {
      setSaving(false)
    }
  }


  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      isCurrentRole: experience.isCurrentRole,
      description: experience.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      const res = await fetch(`/api/profile/experience?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiences(experiences.filter((exp) => exp.id !== id))
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  const formatDateLabel = (start: string, end?: string, current?: boolean) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const e = current ? 'Present' : (end ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
    return `${s} - ${e}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add Work Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Software Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.isCurrentRole}
                    required={!formData.isCurrentRole}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrentRole"
                  checked={formData.isCurrentRole}
                  onChange={(e) => setFormData({ ...formData, isCurrentRole: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isCurrentRole" className="text-sm cursor-pointer font-normal">I am currently working in this role</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Key Responsibilities)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your achievements..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingExperience ? "Update Experience" : "Add Experience"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {experiences.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No work experience added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id} className="bg-card/40 backdrop-blur-sm border-border hover:border-primary/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0 h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{experience.role}</h3>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span>{experience.company}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <div className="flex items-center gap-1 text-muted-foreground font-normal text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDateLabel(experience.startDate, experience.endDate, experience.isCurrentRole)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-2xl">{experience.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10"
                      onClick={() => handleEdit(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
