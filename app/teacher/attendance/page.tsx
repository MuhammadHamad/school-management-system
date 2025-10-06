"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
} from "lucide-react"
import {
  getClasses,
  getStudents,
  getAttendance,
  saveAttendance,
  type Student,
  type AttendanceRecord,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { name: "Mark Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { name: "Reports", href: "/teacher/reports", icon: BarChart3 },
]

type AttendanceStatus = "present" | "absent" | "late" | "excused"

function AttendanceContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const allClasses = getClasses()
    const teacherClasses = allClasses.filter((c) => c.teacherId === "teacher-1")
    setMyClasses(teacherClasses)

    const classParam = searchParams.get("class")
    if (classParam && teacherClasses.find((c) => c.id === classParam)) {
      setSelectedClass(classParam)
    } else if (teacherClasses.length > 0) {
      setSelectedClass(teacherClasses[0].id)
    }
  }, [searchParams])

  useEffect(() => {
    if (!selectedClass) return

    const classStudents = getStudents(selectedClass)
    setStudents(classStudents)

    // Load existing attendance for selected date
    const existingAttendance = getAttendance({ classId: selectedClass, date: selectedDate })
    const attendanceMap: Record<string, AttendanceStatus> = {}

    existingAttendance.forEach((record) => {
      attendanceMap[record.studentId] = record.status
    })

    // Set default to present for students without records
    classStudents.forEach((student) => {
      if (!attendanceMap[student.id]) {
        attendanceMap[student.id] = "present"
      }
    })

    setAttendanceData(attendanceMap)
    setSaved(false)
  }, [selectedClass, selectedDate])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    const records: AttendanceRecord[] = students.map((student) => ({
      id: `attendance-${student.id}-${selectedDate}`,
      studentId: student.id,
      classId: selectedClass,
      date: selectedDate,
      status: attendanceData[student.id] || "present",
      markedBy: user?.email || "",
      markedAt: new Date().toISOString(),
    }))

    saveAttendance(records)
    setSaved(true)

    setTimeout(() => setSaved(false), 3000)
  }

  const getStatusCounts = () => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    }

    Object.values(attendanceData).forEach((status) => {
      counts[status]++
    })

    return counts
  }

  const statusCounts = getStatusCounts()
  const selectedClassName = myClasses.find((c) => c.id === selectedClass)?.name || ""

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout navigation={navigation} title="Teacher Portal">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
            <p className="text-muted-foreground">Record student attendance for your classes</p>
          </div>

          {/* Class and Date Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <Label className="text-sm font-medium mb-2 block">Select Class</Label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 border border-input rounded-lg bg-background"
              >
                {myClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - Grade {cls.grade}
                    {cls.section}
                  </option>
                ))}
              </select>
            </Card>

            <Card className="p-4">
              <Label className="text-sm font-medium mb-2 block">Select Date</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-input rounded-lg bg-background"
              />
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.late}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusCounts.excused}</p>
                  <p className="text-xs text-muted-foreground">Excused</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance Grid - Tablet Optimized */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedClassName} - {students.length} Students
              </h2>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Attendance"}
              </Button>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{student.rollNumber}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={attendanceData[student.id] === "present" ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleStatusChange(student.id, "present")}
                      className="min-w-[80px] touch-manipulation"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Present
                    </Button>

                    <Button
                      variant={attendanceData[student.id] === "absent" ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleStatusChange(student.id, "absent")}
                      className="min-w-[80px] touch-manipulation bg-transparent"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Absent
                    </Button>

                    <Button
                      variant={attendanceData[student.id] === "late" ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleStatusChange(student.id, "late")}
                      className="min-w-[80px] touch-manipulation bg-transparent"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Late
                    </Button>

                    <Button
                      variant={attendanceData[student.id] === "excused" ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleStatusChange(student.id, "excused")}
                      className="min-w-[80px] touch-manipulation bg-transparent"
                    >
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Excused
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {students.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No students found in this class</p>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceContent />
    </Suspense>
  )
}
