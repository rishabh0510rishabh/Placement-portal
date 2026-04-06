"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code, Plus, X, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

type SkillCategory = {
  name: string
  key: string
  skills: string[]
}

const defaultCategories: SkillCategory[] = [
  { name: "Programming Languages", key: "programmingLanguages", skills: [] },
  { name: "Frameworks", key: "frameworks", skills: [] },
  { name: "Tools", key: "tools", skills: [] },
  { name: "Databases", key: "databases", skills: [] },
  { name: "Technologies", key: "technologies", skills: [] },
]

export default function SkillsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<SkillCategory[]>(defaultCategories)
  const [newSkill, setNewSkill] = useState<Record<string, string>>({})

  // Load skills from Supabase
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile?.skills) {
          const loaded = defaultCategories.map(cat => ({
            ...cat,
            skills: data.profile.skills[cat.key] || []
          }));
          setCategories(loaded);
        }
      } catch (err) {
        console.error("Load skills error:", err);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const addSkill = (categoryName: string) => {
    const skill = newSkill[categoryName]?.trim()
    if (!skill) return

    setCategories(
      categories.map((cat) =>
        cat.name === categoryName && !cat.skills.includes(skill)
          ? { ...cat, skills: [...cat.skills, skill] }
          : cat
      )
    )
    setNewSkill({ ...newSkill, [categoryName]: "" })
  }

  const removeSkill = (categoryName: string, skillToRemove: string) => {
    setCategories(
      categories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, skills: cat.skills.filter((s: string) => s !== skillToRemove) }
          : cat
      )
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent, categoryName: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(categoryName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const skillsPayload = categories.reduce((acc, cat) => {
      acc[cat.key] = cat.skills;
      return acc;
    }, {} as any);

    try {
      const res = await fetch('/api/profile/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsPayload }),
      });
      if (res.ok) {
        toast.success("Skills saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save skills");
      }
    } catch (err) {
      console.error("Save skills error:", err);
      toast.error("Connection error");
    } finally {
      setSaving(false);
    }
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
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Skills</h1>
        <p className="text-muted-foreground mt-1">Add your technical skills</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Add ${category.name.toLowerCase()}`}
                    value={newSkill[category.name] || ""}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, [category.name]: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, category.name)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => addSkill(category.name)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {category.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  ) : (
                    category.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 pr-1 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(category.name, skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Skills"}
          </Button>
        </div>
      </form>
    </div>
  )
}
