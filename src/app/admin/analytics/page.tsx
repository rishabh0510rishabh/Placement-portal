"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Building2, TrendingUp, GraduationCap, Loader2 } from "lucide-react"

interface BranchStat {
  branch: string;
  students: number;
  placed: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  applications: number;
  shortlisted: number;
  selected: number;
}

interface Recruiter {
  company: string;
  hired: number;
  avgCTC: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    branchStats: BranchStat[];
    monthlyData: MonthlyData[];
    topRecruiters: Recruiter[];
    totalCompanies: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Aggregating system telemetry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
        <p className="text-red-500 font-medium">Error loading analytics: {error || 'No data available'}</p>
      </div>
    );
  }

  const { branchStats, monthlyData, topRecruiters, totalCompanies } = data;
  const totalStudents = branchStats.reduce((sum, b) => sum + b.students, 0)
  const totalPlaced = branchStats.reduce((sum, b) => sum + b.placed, 0)
  const overallPercentage = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Live placement statistics and system performance insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Placed</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{totalPlaced}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-success">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{overallPercentage}%</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-chart-2">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{totalCompanies}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary text-warning">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch-wise Stats */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Candidate Success by Specialization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {branchStats.length > 0 ? branchStats.map((stat) => (
              <div key={stat.branch}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{stat.branch}</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {stat.placed}/{stat.students} ({stat.percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-center py-8 text-muted-foreground">No placement data available for branches</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Registration & Selection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.length > 0 ? monthlyData.map((data) => (
                <div key={data.month} className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground tracking-tight">{data.month} 2026</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Apps</p>
                      <p className="font-mono text-lg text-foreground">{data.applications}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Shortlist</p>
                      <p className="font-mono text-lg text-primary">{data.shortlisted}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Seized</p>
                      <p className="font-mono text-lg text-success">{data.selected}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-muted-foreground">No chronological movement records</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Recruiters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Elite Talent Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecruiters.length > 0 ? topRecruiters.map((recruiter, index) => (
                <div
                  key={recruiter.company}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5 hover:bg-secondary/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-primary/20 italic">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-foreground">{recruiter.company}</p>
                      <p className="text-xs text-muted-foreground font-mono">AVG CTC: {recruiter.avgCTC}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-foreground">{recruiter.hired}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Hired</p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-muted-foreground">No active recruitment records</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

