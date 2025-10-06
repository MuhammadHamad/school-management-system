"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, GraduationCap, BookOpen, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { createClass } from "@/lib/actions/classes"
import { getTeachers } from "@/lib/actions/teachers"
import { useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default function NewClassPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    section: "",
    teacher_id: "",
  })
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getTeachers().then(setTeachers).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createClass(formData)
      router.push("/admin/classes")
    } catch (err: any) {
      setError(err.message || "Failed to create class")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="max-w-2xl">
          <Link
            href="/admin/classes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to classes
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Add New Class</h1>
            <p className="text-muted-foreground">Create a new class for your school</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics, Science, English"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., 10, 11, 12"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    placeholder="e.g., A, B, C"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher_id">Assign Teacher (Optional)</Label>
                <select
                  id="teacher_id"
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating..." : "Create Class"}
                </Button>
                <Link href="/admin/classes" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
