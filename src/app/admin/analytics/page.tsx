"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Building2, TrendingUp, GraduationCap } from "lucide-react"

const branchStats = [
  { branch: "CSE", students: 450, placed: 380, percentage: 84 },
  { branch: "IT", students: 320, placed: 260, percentage: 81 },
  { branch: "ECE", students: 280, placed: 210, percentage: 75 },
  { branch: "EE", students: 180, placed: 130, percentage: 72 },
  { branch: "ME", students: 200, placed: 140, percentage: 70 },
]

const monthlyData = [
  { month: "Jan", applications: 245, shortlisted: 89, selected: 34 },
  { month: "Feb", applications: 312, shortlisted: 124, selected: 52 },
  { month: "Mar", applications: 456, shortlisted: 178, selected: 78 },
  { month: "Apr", applications: 389, shortlisted: 145, selected: 65 },
]

const topRecruiters = [
  { company: "TCS", hired: 45, avgCTC: "4.5 LPA" },
  { company: "Infosys", hired: 38, avgCTC: "3.8 LPA" },
  { company: "Wipro", hired: 28, avgCTC: "4.0 LPA" },
  { company: "HCL", hired: 22, avgCTC: "4.25 LPA" },
  { company: "Cognizant", hired: 19, avgCTC: "4.0 LPA" },
]

export default function AnalyticsPage() {
  const totalStudents = branchStats.reduce((sum, b) => sum + b.students, 0)
  const totalPlaced = branchStats.reduce((sum, b) => sum + b.placed, 0)
  const overallPercentage = Math.round((totalPlaced / totalStudents) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Placement statistics and insights</p>
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
                <p className="text-sm text-muted-foreground">Recruiting Companies</p>
                <p className="text-3xl font-semibold text-foreground mt-1">45</p>
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
          <CardTitle className="text-lg">Branch-wise Placement Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {branchStats.map((stat) => (
              <div key={stat.branch}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{stat.branch}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.placed}/{stat.students} ({stat.percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{data.month} 2026</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Applications</p>
                      <p className="font-semibold text-foreground">{data.applications}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shortlisted</p>
                      <p className="font-semibold text-primary">{data.shortlisted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Selected</p>
                      <p className="font-semibold text-success">{data.selected}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Recruiters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Top Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecruiters.map((recruiter, index) => (
                <div
                  key={recruiter.company}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{recruiter.company}</p>
                      <p className="text-sm text-muted-foreground">Avg CTC: {recruiter.avgCTC}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-foreground">{recruiter.hired}</p>
                    <p className="text-xs text-muted-foreground">Students Hired</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
