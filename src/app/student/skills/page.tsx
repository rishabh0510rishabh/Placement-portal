"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Code, Plus, X, Save } from "lucide-react"

type SkillCategory = {
  name: string
  skills: string[]
}

const defaultCategories: SkillCategory[] = [
  { name: "Programming Languages", skills: [] },
  { name: "Frameworks", skills: [] },
  { name: "Tools", skills: [] },
  { name: "Databases", skills: [] },
  { name: "Technologies", skills: [] },
]

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>(defaultCategories)
  const [newSkill, setNewSkill] = useState<Record<string, string>>({})

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
          ? { ...cat, skills: cat.skills.filter((s) => s !== skillToRemove) }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Skills data:", categories)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
                {/* Add Skill Input */}
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

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {category.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  ) : (
                    category.skills.map((skill) => (
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
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Skills
          </Button>
        </div>
      </form>
    </div>
  )
}
