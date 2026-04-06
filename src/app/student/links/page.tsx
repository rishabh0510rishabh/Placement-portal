"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, Save, Github, Linkedin, Globe, Loader2, Award } from "lucide-react"

export default function LinksPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "",
  })

  // Load links from Supabase
  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile) {
          setFormData({
            linkedin: data.profile.linkedin || "",
            github: data.profile.github || "",
            portfolio: data.profile.portfolio || "",
            leetcode: data.profile.leetcode || "",
          });
        }
      } catch (err) {
        console.error("Load links error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Professional links updated successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save links.");
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
        <h1 className="text-2xl font-semibold text-foreground">Professional Links</h1>
        <p className="text-muted-foreground mt-1">Add your professional profile links</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Social & Professional Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                type="text"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Profile
              </Label>
              <Input
                id="github"
                type="text"
                placeholder="https://github.com/yourusername"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leetcode" className="flex items-center gap-2">
                <Award className="h-4 w-4 text-orange-500" />
                LeetCode Profile
              </Label>
              <Input
                id="leetcode"
                type="text"
                placeholder="https://leetcode.com/u/yourusername"
                value={formData.leetcode}
                onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Portfolio Website
              </Label>
              <Input
                id="portfolio"
                type="text"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="gap-2 px-6">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Links"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
