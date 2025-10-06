import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getClasses } from "@/lib/actions/classes"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default async function ClassesPage() {
  const classes = await getClasses()

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Classes</h1>
              <p className="text-muted-foreground">Manage all classes in your school</p>
            </div>
            <Link href="/admin/classes/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Grade {cls.grade} - Section {cls.section}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{cls.students?.[0]?.count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teacher:</span>
                    <span className="font-medium text-xs">{cls.teacher?.full_name || "Not assigned"}</span>
                  </div>
                </div>
                <Link href={`/admin/classes/${cls.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    View Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {classes.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first class</p>
              <Link href="/admin/classes/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
