"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, GraduationCap, BookOpen, TrendingUp, TrendingDown } from "lucide-react"
import { getClasses, getStudents, getAttendance } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
]

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState(7)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    if (!user?.schoolId) return

    const classes = getClasses(user.schoolId)
    const students = getStudents()
    const today = new Date()
    const dailyData = []
    const classData: any[] = []

    // Generate daily data
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayAttendance = getAttendance({ date: dateString })

      dailyData.push({
        date: dateString,
        present: dayAttendance.filter((a) => a.status === "present").length,
        absent: dayAttendance.filter((a) => a.status === "absent").length,
        rate:
          dayAttendance.length > 0
            ? Math.round((dayAttendance.filter((a) => a.status === "present").length / dayAttendance.length) * 100)
            : 0,
      })
    }

    // Generate class-wise data
    classes.forEach((cls) => {
      const classAttendance = getAttendance({ classId: cls.id })
      const recentAttendance = classAttendance.filter((a) => {
        const recordDate = new Date(a.date)
        const cutoffDate = new Date(today)
        cutoffDate.setDate(cutoffDate.getDate() - dateRange)
        return recordDate >= cutoffDate
      })

      const presentCount = recentAttendance.filter((a) => a.status === "present").length
      const rate = recentAttendance.length > 0 ? (presentCount / recentAttendance.length) * 100 : 0

      classData.push({
        id: cls.id,
        name: `${cls.name} ${cls.grade}${cls.section}`,
        rate: Math.round(rate),
        present: presentCount,
        total: recentAttendance.length,
      })
    })

    classData.sort((a, b) => b.rate - a.rate)

    // Calculate overall stats
    const allAttendance = getAttendance()
    const recentAttendance = allAttendance.filter((a) => {
      const recordDate = new Date(a.date)
      const cutoffDate = new Date(today)
      cutoffDate.setDate(cutoffDate.getDate() - dateRange)
      return recordDate >= cutoffDate
    })

    const overallPresent = recentAttendance.filter((a) => a.status === "present").length
    const overallRate = recentAttendance.length > 0 ? (overallPresent / recentAttendance.length) * 100 : 0

    // Calculate trend
    const recentDays = dailyData.slice(-3)
    const olderDays = dailyData.slice(0, 3)
    const recentAvg = recentDays.reduce((sum, day) => sum + day.rate, 0) / recentDays.length
    const olderAvg = olderDays.reduce((sum, day) => sum + day.rate, 0) / olderDays.length
    const trend = (recentAvg - olderAvg).toFixed(1)

    setReportData({
      dailyData,
      classData,
      overallRate: Math.round(overallRate),
      trend: Number.parseFloat(trend),
      totalStudents: students.length,
      totalClasses: classes.length,
    })
  }, [user, dateRange])

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Reports</h1>
              <p className="text-muted-foreground">Comprehensive attendance analytics for your school</p>
            </div>
            <Card className="p-4 w-48">
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full p-2 border border-input rounded-lg bg-background text-sm"
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
                    <p className="text-sm text-muted-foreground">Overall Attendance</p>
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
                  <p className="text-sm text-muted-foreground mb-2">Total Students</p>
                  <p className="text-3xl font-bold">{reportData.totalStudents}</p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Classes</p>
                  <p className="text-3xl font-bold">{reportData.totalClasses}</p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Best Performing</p>
                  <p className="text-lg font-bold truncate">{reportData.classData[0]?.name || "N/A"}</p>
                  <p className="text-sm text-chart-1">{reportData.classData[0]?.rate || 0}% attendance</p>
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
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Attendance Rate %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Class-wise Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.classData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="rate" fill="hsl(var(--chart-1))" name="Attendance Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Class Performance Table */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detailed Class Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-3 font-semibold text-sm">Rank</th>
                        <th className="text-left p-3 font-semibold text-sm">Class</th>
                        <th className="text-center p-3 font-semibold text-sm">Attendance Rate</th>
                        <th className="text-center p-3 font-semibold text-sm">Present / Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.classData.map((cls: any, index: number) => (
                        <tr key={cls.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-medium">{index + 1}</td>
                          <td className="p-3 font-medium">{cls.name}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-16 px-2 py-1 rounded-full text-sm font-semibold ${
                                cls.rate >= 90
                                  ? "bg-chart-1/10 text-chart-1"
                                  : cls.rate >= 75
                                    ? "bg-chart-3/10 text-chart-3"
                                    : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {cls.rate}%
                            </span>
                          </td>
                          <td className="p-3 text-center text-muted-foreground">
                            {cls.present} / {cls.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
