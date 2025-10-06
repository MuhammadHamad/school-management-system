"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, Calendar } from "lucide-react"
import Link from "next/link"
import { getClasses, getStudents, getAttendance, type Class } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { name: "Mark Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { name: "Reports", href: "/teacher/reports", icon: BarChart3 },
]

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [myClasses, setMyClasses] = useState<Class[]>([])
  const [todayStats, setTodayStats] = useState({
    totalClasses: 0,
    markedToday: 0,
    totalStudents: 0,
    presentToday: 0,
  })

  useEffect(() => {
    const allClasses = getClasses()
    const teacherClasses = allClasses.filter((c) => c.teacherId === "teacher-1")
    setMyClasses(teacherClasses)

    const today = new Date().toISOString().split("T")[0]
    const todayAttendance = getAttendance({ date: today })

    const classIds = teacherClasses.map((c) => c.id)
    const myStudents = getStudents().filter((s) => classIds.includes(s.classId))
    const myAttendance = todayAttendance.filter((a) => classIds.includes(a.classId))
    const presentCount = myAttendance.filter((a) => a.status === "present").length

    const markedClasses = new Set(myAttendance.map((a) => a.classId)).size

    setTodayStats({
      totalClasses: teacherClasses.length,
      markedToday: markedClasses,
      totalStudents: myStudents.length,
      presentToday: presentCount,
    })
  }, [user])

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout navigation={navigation} title="Teacher Portal">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Here's your overview for today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">My Classes</p>
              <p className="text-3xl font-bold">{todayStats.totalClasses}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-chart-1" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Marked Today</p>
              <p className="text-3xl font-bold">
                {todayStats.markedToday}/{todayStats.totalClasses}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Students</p>
              <p className="text-3xl font-bold">{todayStats.totalStudents}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Present Today</p>
              <p className="text-3xl font-bold">{todayStats.presentToday}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Classes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map((cls) => (
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
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                  </div>
                  <Link href={`/teacher/attendance?class=${cls.id}`}>
                    <Button className="w-full">Mark Attendance</Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-20 text-center">
                    <p className="text-sm font-medium">09:00 AM</p>
                    <p className="text-xs text-muted-foreground">1 hour</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mathematics - Grade 10A</p>
                    <p className="text-sm text-muted-foreground">Room 201</p>
                  </div>
                  <div className="px-3 py-1 bg-chart-1/10 text-chart-1 text-xs font-medium rounded-full">Marked</div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-20 text-center">
                    <p className="text-sm font-medium">11:00 AM</p>
                    <p className="text-xs text-muted-foreground">1 hour</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Science - Grade 10A</p>
                    <p className="text-sm text-muted-foreground">Lab 1</p>
                  </div>
                  <div className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    Pending
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-center">
                    <p className="text-sm font-medium">02:00 PM</p>
                    <p className="text-xs text-muted-foreground">1 hour</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mathematics - Grade 10B</p>
                    <p className="text-sm text-muted-foreground">Room 201</p>
                  </div>
                  <div className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    Pending
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
