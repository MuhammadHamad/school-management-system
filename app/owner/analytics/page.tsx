"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Building2, TrendingUp, Users, DollarSign } from "lucide-react"
import { getAllSchools, getStudents, getTeachers, getAttendance } from "@/lib/mock-data"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "Schools", href: "/owner/schools", icon: Building2 },
  { name: "Analytics", href: "/owner/analytics", icon: TrendingUp },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function OwnerAnalyticsPage() {
  const [dateRange, setDateRange] = useState(30)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    const schools = getAllSchools()
    const allStudents = getStudents()
    const allTeachers = getTeachers()

    // Generate growth data
    const today = new Date()
    const growthData = []
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      // Mock growth data
      const schoolCount = Math.max(1, schools.length - Math.floor(Math.random() * 3))
      const studentCount = Math.floor(allStudents.length * (0.7 + Math.random() * 0.3))

      growthData.push({
        date: dateString,
        schools: schoolCount,
        students: studentCount,
        revenue: schoolCount * 99,
      })
    }

    // School status distribution
    const statusData = [
      { name: "Active", value: schools.filter((s) => s.status === "active").length },
      { name: "Trial", value: schools.filter((s) => s.status === "trial").length },
      { name: "Suspended", value: schools.filter((s) => s.status === "suspended").length },
    ]

    // Plan distribution
    const planData = [
      { name: "Basic", value: schools.filter((s) => s.plan === "Basic").length },
      { name: "Pro", value: schools.filter((s) => s.plan === "Pro").length },
      { name: "Enterprise", value: schools.filter((s) => s.plan === "Enterprise").length },
    ]

    // School performance
    const schoolPerformance = schools.map((school) => {
      const schoolAttendance = getAttendance()
      const presentCount = schoolAttendance.filter((a) => a.status === "present").length
      const rate = schoolAttendance.length > 0 ? (presentCount / schoolAttendance.length) * 100 : 0

      return {
        name: school.name,
        rate: Math.round(rate),
      }
    })

    setAnalyticsData({
      growthData,
      statusData,
      planData,
      schoolPerformance: schoolPerformance.slice(0, 5),
      totalRevenue: schools.filter((s) => s.status === "active").length * 99,
      totalSchools: schools.length,
      totalUsers: allStudents.length + allTeachers.length,
    })
  }, [dateRange])

  return (
    <ProtectedRoute allowedRoles={["saas_owner"]}>
      <DashboardLayout navigation={navigation} title="SaaS Owner Panel">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
              <p className="text-muted-foreground">Comprehensive insights across all schools</p>
            </div>
            <Card className="p-4 w-48">
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full p-2 border border-input rounded-lg bg-background text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </Card>
          </div>

          {analyticsData && (
            <>
              {/* Summary Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Total Schools</p>
                  <p className="text-3xl font-bold">{analyticsData.totalSchools}</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-chart-1" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{analyticsData.totalUsers}</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-chart-3" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${analyticsData.totalRevenue}</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-chart-4" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                  <p className="text-3xl font-bold">+12%</p>
                </Card>
              </div>

              {/* Growth Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Platform Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.growthData}>
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
                        dataKey="schools"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Schools"
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Students"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.growthData.slice(-7)}>
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
                      <Bar dataKey="revenue" fill="hsl(var(--chart-3))" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Distribution Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">School Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.planData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.planData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

              {/* Top Performing Schools */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performing Schools</h3>
                <div className="space-y-4">
                  {analyticsData.schoolPerformance.map((school: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{school.name}</p>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-chart-1 rounded-full" style={{ width: `${school.rate}%` }}></div>
                        </div>
                      </div>
                      <div className="w-16 text-right font-semibold">{school.rate}%</div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
