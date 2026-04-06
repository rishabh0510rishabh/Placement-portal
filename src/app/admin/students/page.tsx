"use client"

import { useState, useEffect } from "react"
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
import { Users, Search, Eye, Mail, Phone, Loader2, GraduationCap, Link2 } from "lucide-react"
import { toast } from "sonner"
import { StudentProfile } from "@/types/database"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/students")
      const result = await res.json()
      if (res.ok) {
        setStudents(result.students)
      } else {
        toast.error(result.error || "Failed to load student list")
      }
    } catch (err) {
      toast.error("Connection error")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBranch = branchFilter === "All" || student.branch === branchFilter
    return matchesSearch && matchesBranch
  })

  const uniqueBranches = Array.from(new Set(students.map(s => s.branch)))

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Student List</h1>
          <p className="text-muted-foreground mt-1 text-sm italic">Manage student data and records</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1.5 rounded-full border border-white/10">List Updated</span>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, roll number, or email..."
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl">
                 <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Disciplines</SelectItem>
                {uniqueBranches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
               <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.01]">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Student Name</TableHead>
                  <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-gray-500">Roll Number</TableHead>
                  <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-gray-500 text-center">Course / Branch</TableHead>
                  <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-gray-500 text-right">C.G.P.A</TableHead>
                  <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-gray-500 text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-white/[0.02] transition-colors border-white/5">
                    <TableCell className="py-5">
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                           {student.fullName.charAt(0)}
                         </div>
                         <div>
                            <span className="font-bold text-white tracking-tight">{student.fullName}</span>
                            <p className="text-[10px] text-gray-500 tracking-tight lowercase">{student.email}</p>
                         </div>
                       </div>
                    </TableCell>
                    <TableCell className="py-5 font-bold text-gray-400">{student.rollNumber}</TableCell>
                    <TableCell className="py-5 text-center px-4">
                       <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black border-white/10 bg-white/5">
                         {student.branch} | Sem {student.currentSemester} 
                       </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-right font-black text-emerald-500">{student.cgpa?.toFixed(2)}</TableCell>
                    <TableCell className="text-right py-5 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-9 hover:bg-white/5 border border-transparent hover:border-white/10 text-xs font-bold"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-3 w-3 mr-2" /> View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Profile Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Student Profile</DialogTitle>
            <DialogDescription>Information for {selectedStudent?.fullName}</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black text-black">
                       {selectedStudent.fullName.charAt(0)}
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-white">{selectedStudent.fullName}</h3>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-black">{selectedStudent.rollNumber}</p>
                    </div>
                 </div>
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest">Registered</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-white/5 border-white/5 col-span-1 p-4 shadow-none">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Overall CGPA</p>
                    <p className="text-xl font-black text-white">{selectedStudent.cgpa?.toFixed(2)} CGPA</p>
                 </Card>
                 <Card className="bg-white/5 border-white/5 col-span-1 p-4 shadow-none">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Backlogs</p>
                    <p className={`text-xl font-black ${selectedStudent.activeBacklogs > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                       {selectedStudent.activeBacklogs} Backlogs
                    </p>
                 </Card>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300 font-medium">{selectedStudent.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300 font-medium">{selectedStudent.phoneNumber}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm pt-2 border-t border-white/5">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300 font-medium">{selectedStudent.branch} | Semester {selectedStudent.currentSemester}</span>
                 </div>
              </div>

              {selectedStudent.resumeUrl && (
                <a 
                  href={selectedStudent.resumeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-sm uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                >
                   <Link2 className="h-4 w-4" /> Download Resume
                </a>
              )}

              <div className="flex justify-end pt-4">
                <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="rounded-xl px-10 text-xs font-black uppercase tracking-widest">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
