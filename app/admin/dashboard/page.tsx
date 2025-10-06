import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/actions/analytics"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your school.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Teachers</p>
              <p className="text-3xl font-bold">{stats.totalTeachers}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
              <p className="text-3xl font-bold">{stats.totalClasses}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Today's Attendance</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/classes/new">
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Add New Class</h3>
                      <p className="text-sm text-muted-foreground">Create a new class</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/teachers/new">
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Add New Teacher</h3>
                      <p className="text-sm text-muted-foreground">Register a teacher</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/students/new">
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Add New Student</h3>
                      <p className="text-sm text-muted-foreground">Enroll a student</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Attendance marked for Class 10-A</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">New teacher Sarah Johnson added</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-chart-3 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Class 11-B created</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
