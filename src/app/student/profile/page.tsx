"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, Loader2, CheckCircle2, FileText, GraduationCap, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const branches = [
  { id: "CSE", name: "Computer Science and Engineering" },
  { id: "CSE_AI", name: "CSE (Artificial Intelligence)" },
  { id: "CSE_DS", name: "CSE (Data Science)" },
  { id: "IT", name: "Information Technology" },
  { id: "ECE", name: "Electronics and Communication" },
  { id: "EN", name: "Electrical Engineering" },
  { id: "ME", name: "Mechanical Engineering" },
  { id: "CE", name: "Civil Engineering" },
]

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    collegeId: "",
    branch: "",
    section: "",
    phoneNumber: "",
    email: "",
    currentSemester: "",
    cgpa: "",
    activeBacklogs: "0",
    resumeUrl: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data.profile) {
        setFormData({
          fullName: data.profile.fullName || "",
          rollNumber: data.profile.rollNumber || "",
          collegeId: data.profile.collegeId || "",
          branch: data.profile.branch || "",
          section: data.profile.section || "",
          phoneNumber: data.profile.phoneNumber || "",
          email: data.profile.email || "",
          currentSemester: data.profile.currentSemester?.toString() || "1",
          cgpa: data.profile.cgpa?.toString() || "",
          activeBacklogs: data.profile.activeBacklogs?.toString() || "0",
          resumeUrl: data.profile.resumeUrl || "",
        })
      }
    } catch (err) {
      toast.error("Failed to sync profile telemetry")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentSemester: parseInt(formData.currentSemester),
          cgpa: parseFloat(formData.cgpa),
          activeBacklogs: parseInt(formData.activeBacklogs)
        }),
      })
      if (res.ok) {
        toast.success("Profile verified and updated!")
        fetchProfile()
      } else {
        const err = await res.json()
        toast.error(err.error || "Profile synchronization failure")
      }
    } catch (err) {
      toast.error("Networking terminal error")
    } finally {
      setSaving(false)
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
    <div className="space-y-6 w-full pb-10 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">Student Profile Terminal</h1>
          <p className="text-muted-foreground text-sm font-light italic">Sync your institutional dossier for recruitment eligibility</p>
        </div>
        {formData.rollNumber && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="h-4 w-4" />
            Verified Dossier
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Dossier */}
        <Card className="bg-white/5 border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
               <User className="h-5 w-5 text-primary" />
               <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400">Institutional Identity</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Legal Full Name</Label>
                <Input
                  placeholder="e.g., Rohan Sharma"
                  className="bg-white/[0.03] border-white/5 focus:border-primary/50 h-12 rounded-xl transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Institutional Roll Number</Label>
                <Input
                  placeholder="210133..."
                  className="bg-white/[0.03] border-white/5 focus:border-primary/50 h-12 rounded-xl transition-all"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">College ID Card No.</Label>
                <Input
                  placeholder="RKGIT-..."
                  className="bg-white/[0.03] border-white/5 focus:border-primary/50 h-12 rounded-xl transition-all"
                  value={formData.collegeId}
                  onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-500 pl-1">Department Major</Label>
                <Select value={formData.branch} onValueChange={(val) => setFormData({ ...formData, branch: val })}>
                  <SelectTrigger className="bg-white/[0.03] border-white/5 h-12 rounded-xl text-xs">
                    <SelectValue placeholder="Identify your major" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Eligibility Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/5 shadow-2xl col-span-1">
             <CardHeader className="border-b border-white/5 bg-white/[0.01] p-4 text-center">
                <GraduationCap className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-gray-400">Current CGPA</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g., 8.50"
                  className="bg-zinc-900 border-white/5 h-14 text-2xl font-black text-center text-primary rounded-2xl"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  required
                />
                <p className="text-[9px] text-center text-gray-600 mt-3 font-bold uppercase tracking-widest">Strict Evaluation Gate</p>
             </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/5 shadow-2xl col-span-1">
             <CardHeader className="border-b border-white/5 bg-white/[0.01] p-4 text-center">
                <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-gray-400">Active Backlogs</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="bg-zinc-900 border-white/5 h-14 text-2xl font-black text-center text-red-500 rounded-2xl"
                  value={formData.activeBacklogs}
                  onChange={(e) => setFormData({ ...formData, activeBacklogs: e.target.value })}
                  required
                />
                <p className="text-[9px] text-center text-gray-600 mt-3 font-bold uppercase tracking-widest">Placement Barrier</p>
             </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/5 shadow-2xl col-span-1">
             <CardHeader className="border-b border-white/5 bg-white/[0.01] p-4 text-center">
                <FileText className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-gray-400">Resume Link</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <Input
                  placeholder="G-Drive / PDF Link"
                  className="bg-zinc-900 border-white/5 h-14 text-xs font-bold text-center text-blue-400 rounded-2xl"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  required
                />
                <p className="text-[9px] text-center text-gray-600 mt-3 font-bold uppercase tracking-widest">Public Sharing Only</p>
             </CardContent>
          </Card>
        </div>

        {/* Global Action Terminal */}
        <div className="flex justify-center pt-6">
           <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-black font-black px-12 py-8 rounded-2xl text-xl shadow-2xl shadow-primary/20 transition-all hover:scale-105">
              {saving ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <Save className="h-6 w-6 mr-3" />}
              {saving ? "SYNCHRONIZING..." : "UPLOAD DOSSIER"}
           </Button>
        </div>
      </form>
    </div>
  )
}
