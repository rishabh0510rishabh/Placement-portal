"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, Loader2, CheckCircle2 } from "lucide-react"

const courses = [
  {
    name: "B.Tech.",
    branches: [
      { id: "CSE", name: "Computer Science and Engineering" },
      { id: "CSE_AI", name: "CSE (Artificial Intelligence)" },
      { id: "CSE_DS", name: "CSE (Data Science)" },
      { id: "IT", name: "Information Technology" },
      { id: "ECE", name: "Electronics and Communication" },
      { id: "EN", name: "Electrical Engineering" },
      { id: "ME", name: "Mechanical Engineering" },
      { id: "CE", name: "Civil Engineering" },
    ]
  },
]

const sections = ["A", "B", "C", "D", "E", "F", "G"]
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    collegeId: "",
    course: "B.Tech.",
    branch: "",
    section: "",
    phoneNumber: "",
    email: "",
    currentSemester: "",
  })

  // Load profile from Supabase
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile) {
          setFormData({
            fullName: data.profile.fullName || "",
            rollNumber: data.profile.rollNumber || "",
            collegeId: data.profile.collegeId || "",
            course: "B.Tech.",
            branch: data.profile.branch || "",
            section: data.profile.section || "",
            phoneNumber: data.profile.phoneNumber || "",
            email: data.profile.email || "",
            currentSemester: data.profile.currentSemester?.toString() || "",
          });
        }
      } catch (err) {
        console.error("Load profile error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentSemester: parseInt(formData.currentSemester)
        }),
      });
      if (res.ok) {
        alert("Profile saved successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save profile.");
      }
    } catch (err) {
      console.error("Save error:", err);
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
    <div className="space-y-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Profile</h1>
          <p className="text-muted-foreground">Keep your primary academic and contact details updated.</p>
        </div>
        {formData.rollNumber && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Verified Profile
          </div>
        )}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
        <CardHeader className="flex flex-row items-center gap-2 border-b border-border/50 pb-4 mb-6">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Core Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Rohan Sharma"
                  className="bg-background/50"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="2101330100..."
                  className="bg-background/50"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeId">College Student ID</Label>
                <Input
                  id="collegeId"
                  placeholder="RKGIT-2021-..."
                  className="bg-background/50"
                  value={formData.collegeId}
                  onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch / Department</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) => setFormData({ ...formData, branch: value })}
                >
                  <SelectTrigger id="branch" className="bg-background/50">
                    <SelectValue placeholder="Identify your major" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses[0].branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Class Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger id="section" className="bg-background/50">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Current Academic Semester</Label>
                <Select
                  value={formData.currentSemester}
                  onValueChange={(value) => setFormData({ ...formData, currentSemester: value })}
                >
                  <SelectTrigger id="semester" className="bg-background/50">
                    <SelectValue placeholder="Select current year" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Active Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91"
                  className="bg-background/50"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Official College Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-background/50 opacity-70"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button type="submit" disabled={saving} className="gap-2 px-8 py-6 text-lg h-auto shadow-lg hover:shadow-primary/20 transition-all">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {saving ? "Updating..." : "Update Official Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
