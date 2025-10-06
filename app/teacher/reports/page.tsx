"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import { getClasses, getStudents, getAttendance, type Class } from "@/lib/mock-data"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const navigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { name: "Mark Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { name: "Reports", href: "/teacher/reports", icon: BarChart3 },
]

const COLORS = {
  present: "hsl(var(--chart-1))",
  absent: "hsl(var(--destructive))",
  late: "hsl(var(--chart-3))",
  excused: "hsl(var(--chart-4))",
}

function ReportsContent() {
  const searchParams = useSearchParams()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [myClasses, setMyClasses] = useState<Class[]>([])
  const [dateRange, setDateRange] = useState(7)
  const [reportData, setReportData] = useState<any>(null)

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

    const students = getStudents(selectedClass)
    const today = new Date()
    const dailyData = []
    const statusTotals = { present: 0, absent: 0, late: 0, excused: 0 }

    // Generate data for the last N days
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayAttendance = getAttendance({ classId: selectedClass, date: dateString })

      const dayCounts = {
        date: dateString,
        present: dayAttendance.filter((a) => a.status === "present").length,
        absent: dayAttendance.filter((a) => a.status === "absent").length,
        late: dayAttendance.filter((a) => a.status === "late").length,
        excused: dayAttendance.filter((a) => a.status === "excused").length,
      }

      statusTotals.present += dayCounts.present
      statusTotals.absent += dayCounts.absent
      statusTotals.late += dayCounts.late
      statusTotals.excused += dayCounts.excused

      dailyData.push(dayCounts)
    }

    // Calculate student-wise attendance
    const studentStats = students.map((student) => {
      const studentAttendance = getAttendance({ studentId: student.id })
      const recentAttendance = studentAttendance.slice(-dateRange)

      const presentCount = recentAttendance.filter((a) => a.status === "present").length
      const rate = recentAttendance.length > 0 ? (presentCount / recentAttendance.length) * 100 : 0

      return {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        attendanceRate: Math.round(rate),
        present: recentAttendance.filter((a) => a.status === "present").length,
        absent: recentAttendance.filter((a) => a.status === "absent").length,
        late: recentAttendance.filter((a) => a.status === "late").length,
        excused: recentAttendance.filter((a) => a.status === "excused").length,
      }
    })

    // Sort by attendance rate
    studentStats.sort((a, b) => a.attendanceRate - b.attendanceRate)

    // Calculate overall stats
    const totalRecords = statusTotals.present + statusTotals.absent + statusTotals.late + statusTotals.excused
    const overallRate = totalRecords > 0 ? (statusTotals.present / totalRecords) * 100 : 0

    // Calculate trend
    const recentDays = dailyData.slice(-3)
    const olderDays = dailyData.slice(0, 3)
    const recentRate =
      recentDays.reduce((sum, day) => sum + day.present, 0) /
      recentDays.reduce((sum, day) => sum + day.present + day.absent + day.late + day.excused, 0)
    const olderRate =
      olderDays.reduce((sum, day) => sum + day.present, 0) /
      olderDays.reduce((sum, day) => sum + day.present + day.absent + day.late + day.excused, 0)
    const trend = ((recentRate - olderRate) * 100).toFixed(1)

    setReportData({
      dailyData,
      statusTotals,
      studentStats,
      overallRate: Math.round(overallRate),
      trend: Number.parseFloat(trend),
    })
  }, [selectedClass, dateRange])

  const pieData = reportData
    ? [
        { name: "Present", value: reportData.statusTotals.present },
        { name: "Absent", value: reportData.statusTotals.absent },
        { name: "Late", value: reportData.statusTotals.late },
        { name: "Excused", value: reportData.statusTotals.excused },
      ]
    : []

  const selectedClassName = myClasses.find((c) => c.id === selectedClass)?.name || ""

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout navigation={navigation} title="Teacher Portal">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Attendance Reports</h1>
            <p className="text-muted-foreground">View detailed attendance analytics and trends</p>
          </div>

          {/* Filters */}
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
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full p-2 border border-input rounded-lg bg-background"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </Card>
          </div>

          {reportData && (
            <>
              {/* Summary Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Overall Rate</p>
                    {reportData.trend !== 0 && (
                      <div
                        className={`flex items-center gap-1 text-xs ${reportData.trend > 0 ? "text-chart-1" : "text-destructive"}`}
                      >
                        {reportData.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(reportData.trend)}%
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-bold">{reportData.overallRate}%</p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Present</p>
                  <p className="text-3xl font-bold text-chart-1">{reportData.statusTotals.present}</p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Absent</p>
                  <p className="text-3xl font-bold text-destructive">{reportData.statusTotals.absent}</p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Late</p>
                  <p className="text-3xl font-bold text-chart-3">{reportData.statusTotals.late}</p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Daily Attendance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke={COLORS.present} strokeWidth={2} name="Present" />
                      <Line type="monotone" dataKey="absent" stroke={COLORS.absent} strokeWidth={2} name="Absent" />
                      <Line type="monotone" dataKey="late" stroke={COLORS.late} strokeWidth={2} name="Late" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Student-wise Report */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Student Attendance Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-3 font-semibold text-sm">Roll No.</th>
                        <th className="text-left p-3 font-semibold text-sm">Name</th>
                        <th className="text-center p-3 font-semibold text-sm">Rate</th>
                        <th className="text-center p-3 font-semibold text-sm">Present</th>
                        <th className="text-center p-3 font-semibold text-sm">Absent</th>
                        <th className="text-center p-3 font-semibold text-sm">Late</th>
                        <th className="text-center p-3 font-semibold text-sm">Excused</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.studentStats.map((student: any) => (
                        <tr key={student.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-mono text-sm">{student.rollNumber}</td>
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-16 px-2 py-1 rounded-full text-sm font-semibold ${
                                student.attendanceRate >= 90
                                  ? "bg-chart-1/10 text-chart-1"
                                  : student.attendanceRate >= 75
                                    ? "bg-chart-3/10 text-chart-3"
                                    : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {student.attendanceRate}%
                            </span>
                          </td>
                          <td className="p-3 text-center text-chart-1 font-medium">{student.present}</td>
                          <td className="p-3 text-center text-destructive font-medium">{student.absent}</td>
                          <td className="p-3 text-center text-chart-3 font-medium">{student.late}</td>
                          <td className="p-3 text-center text-chart-4 font-medium">{student.excused}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {!reportData && (
            <Card className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading report data...</p>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function TeacherReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsContent />
    </Suspense>
  )
}
