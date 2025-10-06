import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Plus, Edit, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getStudents } from "@/lib/actions/students"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Students</h1>
              <p className="text-muted-foreground">Manage all students in your school</p>
            </div>
            <Link href="/admin/students/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Roll Number</th>
                    <th className="text-left p-4 font-semibold text-sm">Name</th>
                    <th className="text-left p-4 font-semibold text-sm">Class</th>
                    <th className="text-left p-4 font-semibold text-sm">Parent Contact</th>
                    <th className="text-right p-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm">{student.roll_number}</td>
                      <td className="p-4 font-medium">{student.full_name}</td>
                      <td className="p-4 text-sm">
                        {student.class
                          ? `${student.class.name} (${student.class.grade}${student.class.section})`
                          : "Not assigned"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{student.parent_phone || "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {students.length === 0 && (
            <Card className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first student</p>
              <Link href="/admin/students/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
