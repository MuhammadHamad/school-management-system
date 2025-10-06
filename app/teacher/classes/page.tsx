"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { getClasses, getStudents, type Class } from "@/lib/mock-data"

const navigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { name: "Mark Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { name: "Reports", href: "/teacher/reports", icon: BarChart3 },
]

export default function TeacherClassesPage() {
  const [myClasses, setMyClasses] = useState<Class[]>([])

  useEffect(() => {
    const allClasses = getClasses()
    const teacherClasses = allClasses.filter((c) => c.teacherId === "teacher-1")
    setMyClasses(teacherClasses)
  }, [])

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout navigation={navigation} title="Teacher Portal">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Classes</h1>
            <p className="text-muted-foreground">View and manage your assigned classes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myClasses.map((cls) => {
              const students = getStudents(cls.id)
              return (
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
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {students.length} {students.length === 1 ? "Student" : "Students"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/teacher/attendance?class=${cls.id}`} className="flex-1">
                      <Button className="w-full">Mark Attendance</Button>
                    </Link>
                    <Link href={`/teacher/reports?class=${cls.id}`}>
                      <Button variant="outline" size="icon" className="bg-transparent">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          {myClasses.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes assigned</h3>
              <p className="text-muted-foreground">Contact your administrator to get classes assigned to you</p>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
