"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Search, Eye, Mail, Phone } from "lucide-react"

type Student = {
  id: string
  name: string
  email: string
  phone: string
  rollNumber: string
  branch: string
  cgpa: number
  skills: string[]
  applications: number
  status: "active" | "placed"
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul.kumar@rkgit.edu.in",
    phone: "+91 98765 43210",
    rollNumber: "2100910100001",
    branch: "CSE",
    cgpa: 8.5,
    skills: ["React", "Node.js", "Python"],
    applications: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya.singh@rkgit.edu.in",
    phone: "+91 98765 43211",
    rollNumber: "2100910100002",
    branch: "IT",
    cgpa: 9.0,
    skills: ["Java", "Spring Boot", "AWS"],
    applications: 3,
    status: "placed",
  },
  {
    id: "3",
    name: "Amit Sharma",
    email: "amit.sharma@rkgit.edu.in",
    phone: "+91 98765 43212",
    rollNumber: "2100910100003",
    branch: "CSE",
    cgpa: 7.8,
    skills: ["JavaScript", "MongoDB", "Express"],
    applications: 4,
    status: "active",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha.gupta@rkgit.edu.in",
    phone: "+91 98765 43213",
    rollNumber: "2100910100004",
    branch: "ECE",
    cgpa: 8.2,
    skills: ["VLSI", "Embedded Systems", "C++"],
    applications: 2,
    status: "active",
  },
  {
    id: "5",
    name: "Vikram Patel",
    email: "vikram.patel@rkgit.edu.in",
    phone: "+91 98765 43214",
    rollNumber: "2100910100005",
    branch: "CSE",
    cgpa: 8.8,
    skills: ["Python", "Machine Learning", "TensorFlow"],
    applications: 6,
    status: "placed",
  },
]

const branches = ["All", "CSE", "IT", "ECE", "EE", "ME", "CE"]

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("All")
  const [cgpaFilter, setCgpaFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = branchFilter === "All" || student.branch === branchFilter
    const matchesCgpa =
      cgpaFilter === "all" ||
      (cgpaFilter === "9+" && student.cgpa >= 9) ||
      (cgpaFilter === "8-9" && student.cgpa >= 8 && student.cgpa < 9) ||
      (cgpaFilter === "7-8" && student.cgpa >= 7 && student.cgpa < 8) ||
      (cgpaFilter === "6-7" && student.cgpa >= 6 && student.cgpa < 7)
    return matchesSearch && matchesBranch && matchesCgpa
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Students</h1>
        <p className="text-muted-foreground mt-1">Manage registered students</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch === "All" ? "All Branches" : branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="CGPA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All CGPA</SelectItem>
                <SelectItem value="9+">9.0 and above</SelectItem>
                <SelectItem value="8-9">8.0 - 9.0</SelectItem>
                <SelectItem value="7-8">7.0 - 8.0</SelectItem>
                <SelectItem value="6-7">6.0 - 7.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.cgpa.toFixed(1)}</TableCell>
                  <TableCell>{student.applications}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        student.status === "placed"
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      }
                    >
                      {student.status === "placed" ? "Placed" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>View student details and information.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">
                    {selectedStudent.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.rollNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="font-medium text-foreground">{selectedStudent.branch}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">CGPA</p>
                  <p className="font-medium text-foreground">{selectedStudent.cgpa.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.phone}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
