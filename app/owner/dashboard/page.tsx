"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getAllSchools, getTeachers, getStudents, getAttendance } from "@/lib/mock-data"

const navigation = [
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "Schools", href: "/owner/schools", icon: Building2 },
  { name: "Analytics", href: "/owner/analytics", icon: TrendingUp },
]

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    monthlyRevenue: 0,
    avgAttendanceRate: 0,
  })
  const [recentSchools, setRecentSchools] = useState<any[]>([])

  useEffect(() => {
    const schools = getAllSchools()
    const allStudents = getStudents()
    const allTeachers = getTeachers()

    // Calculate attendance rate
    const today = new Date().toISOString().split("T")[0]
    const todayAttendance = getAttendance({ date: today })
    const presentCount = todayAttendance.filter((a) => a.status === "present").length
    const avgRate = todayAttendance.length > 0 ? (presentCount / todayAttendance.length) * 100 : 0

    // Calculate revenue (mock calculation)
    const activeSchools = schools.filter((s) => s.status === "active")
    const monthlyRevenue = activeSchools.length * 99 // $99 per school

    setStats({
      totalSchools: schools.length,
      activeSchools: activeSchools.length,
      totalStudents: allStudents.length,
      totalTeachers: allTeachers.length,
      monthlyRevenue,
      avgAttendanceRate: Math.round(avgRate),
    })

    // Get recent schools
    const sorted = [...schools].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setRecentSchools(sorted.slice(0, 5))
  }, [])

  return (
    <ProtectedRoute allowedRoles={["saas_owner"]}>
      <DashboardLayout navigation={navigation} title="SaaS Owner Panel">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
            <p className="text-muted-foreground">Monitor and manage your entire SaaS platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Schools</p>
              <p className="text-3xl font-bold">{stats.totalSchools}</p>
              <p className="text-xs text-chart-1 mt-1">{stats.activeSchools} active</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalStudents + stats.totalTeachers}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalStudents} students, {stats.totalTeachers} teachers
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold">${stats.monthlyRevenue}</p>
              <p className="text-xs text-chart-1 mt-1">+12% from last month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Avg Attendance Rate</p>
              <p className="text-3xl font-bold">{stats.avgAttendanceRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Across all schools</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-chart-2" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold">{stats.activeSchools}</p>
              <p className="text-xs text-muted-foreground mt-1">All plans</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-chart-5" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Trial Schools</p>
              <p className="text-3xl font-bold">{stats.totalSchools - stats.activeSchools}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending conversion</p>
            </Card>
          </div>

          {/* Recent Schools */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Schools</h2>
              <Link href="/owner/schools">
                <Button variant="outline" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                {recentSchools.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{school.name}</p>
                        <p className="text-sm text-muted-foreground">{school.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{school.plan}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(school.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          school.status === "active"
                            ? "bg-chart-1/10 text-chart-1"
                            : school.status === "trial"
                              ? "bg-chart-3/10 text-chart-3"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {school.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/owner/schools">
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manage Schools</h3>
                      <p className="text-sm text-muted-foreground">View all schools</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/owner/analytics">
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Analytics</h3>
                      <p className="text-sm text-muted-foreground">Platform insights</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support Tickets</h3>
                    <p className="text-sm text-muted-foreground">3 pending</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
