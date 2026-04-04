"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Save, Calculator, Loader2 } from "lucide-react"

const semesters = [1, 2, 3, 4, 5, 6, 7]

export default function AcademicsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gpas, setGpas] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  })
  const [cgpa, setCgpa] = useState<number | null>(null)

  // Fetch data on load
  useEffect(() => {
    async function fetchAcademics() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile?.semesters) {
          const loadedGpas = { ...gpas };
          data.profile.semesters.forEach((sem: any) => {
            loadedGpas[sem.semester] = sem.gpa.toString();
          });
          setGpas(loadedGpas);
        }
      } catch (err) {
        console.error("Failed to load academics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAcademics();
  }, []);

  useEffect(() => {
    const validGpas = Object.values(gpas)
      .map((gpa) => parseFloat(gpa))
      .filter((gpa) => !isNaN(gpa) && gpa >= 0 && gpa <= 10)

    if (validGpas.length > 0) {
      const average = validGpas.reduce((sum, gpa) => sum + gpa, 0) / validGpas.length
      setCgpa(Math.round(average * 100) / 100)
    } else {
      setCgpa(null)
    }
  }, [gpas])

  const handleGpaChange = (sem: number, value: string) => {
    const numValue = parseFloat(value)
    if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 10)) {
      setGpas({ ...gpas, [sem]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gpas, cgpa }),
      });
      if (res.ok) {
        alert("Academics updated successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes.");
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
        <h1 className="text-2xl font-semibold text-foreground">Academic Details</h1>
        <p className="text-muted-foreground mt-1">Enter your semester-wise GPA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Semester GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {semesters.map((sem) => (
                  <div key={sem} className="space-y-2">
                    <Label htmlFor={`sem-${sem}`}>Semester {sem}</Label>
                    <Input
                      id={`sem-${sem}`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="0.00"
                      value={gpas[sem]}
                      onChange={(e) => handleGpaChange(sem, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Academic Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border h-fit">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Calculated CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-primary">
                {cgpa !== null ? cgpa.toFixed(2) : "--"}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {cgpa !== null
                  ? `Based on ${Object.values(gpas).filter((g) => g !== "").length} semester(s)`
                  : "Enter GPAs to calculate"}
              </p>
            </div>
            {cgpa !== null && (
              <div className="mt-4 p-4 rounded-lg bg-secondary/50">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Grade Summary</p>
                  {cgpa >= 9 && <p>Outstanding Performance</p>}
                  {cgpa >= 8 && cgpa < 9 && <p>Excellent Performance</p>}
                  {cgpa >= 7 && cgpa < 8 && <p>Very Good Performance</p>}
                  {cgpa >= 6 && cgpa < 7 && <p>Good Performance</p>}
                  {cgpa < 6 && <p>Needs Improvement</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
