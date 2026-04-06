"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Plus, ExternalLink, Trash2, CheckCircle2, Loader2, Info } from "lucide-react"

export default function ResumePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumeData, setResumeData] = useState({
    name: "",
    url: "",
    uploadedAt: null as string | null
  })

  // Load resume from Supabase
  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile) {
          setResumeData({
            name: data.profile.resumeFilename || "Primary Resume",
            url: data.profile.resumeUrl || "",
            uploadedAt: data.profile.resumeUploadedAt || null
          });
        }
      } catch (err) {
        console.error("Load resume error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeUrl: resumeData.url, 
          resumeFilename: resumeData.name 
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResumeData({
          ...resumeData,
          uploadedAt: data.profile.resumeUploadedAt
        });
        alert("Resume updated successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!confirm("Remove this resume?")) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile/resume', { method: 'DELETE' });
      if (res.ok) {
        setResumeData({ name: "", url: "", uploadedAt: null });
        alert("Resume removed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Resume Management</h1>
        <p className="text-muted-foreground">Manage your professional document for job applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Primary Resume
                </CardTitle>
                {resumeData.url && (
                  <Badge variant="success" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Resume Label</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Software Engineer Resume"
                    className="bg-background/50"
                    value={resumeData.name}
                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Resume Hosting URL (Google Drive / Dropbox)</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://drive.google.com/..."
                    className="bg-background/50"
                    value={resumeData.url}
                    onChange={(e) => setResumeData({ ...resumeData, url: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Info className="h-3 w-3" />
                    Make sure the link sharing is set to "Anyone with the link can view"
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  {resumeData.url && (
                    <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleDelete} disabled={saving}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                  <Button type="submit" disabled={saving} className="gap-2 px-8">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {resumeData.url ? "Update Resume" : "Save Resume"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {resumeData.url && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{resumeData.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Updated {resumeData.uploadedAt ? new Date(resumeData.uploadedAt).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={resumeData.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Link
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-secondary/20 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/80">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-primary">1</div>
                <p>Use a professional filename (e.g. <strong>Rohan_Sharma_Resume.pdf</strong>).</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-primary">2</div>
                <p>Ensure your Google Drive link has <strong>Public Access</strong> enabled.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-primary">3</div>
                <p>Keep your resume updated before every job application.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
