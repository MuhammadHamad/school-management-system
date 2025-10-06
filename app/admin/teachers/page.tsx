import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Plus, Mail, Phone, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getTeachers } from "@/lib/actions/teachers"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Teachers</h1>
              <p className="text-muted-foreground">Manage all teachers in your school</p>
            </div>
            <Link href="/admin/teachers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center shrink-0">
                    <Users className="w-8 h-8 text-chart-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{teacher.full_name}</h3>
                        <p className="text-sm text-muted-foreground">Teacher ID: {teacher.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{teacher.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        Assigned Classes:{" "}
                        <span className="text-foreground">
                          {teacher.classes && teacher.classes.length > 0
                            ? teacher.classes.map((c: any) => `${c.name} (${c.grade}${c.section})`).join(", ")
                            : "No classes assigned"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {teachers.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first teacher</p>
              <Link href="/admin/teachers/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
