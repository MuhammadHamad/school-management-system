"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Users, GraduationCap, BookOpen, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { createStudent } from "@/lib/actions/students"
import { getClasses } from "@/lib/actions/classes"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Teachers", href: "/admin/teachers", icon: Users },
  { name: "Students", href: "/admin/students", icon: GraduationCap },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
]

export default function NewStudentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: "",
    roll_number: "",
    class_id: "",
    date_of_birth: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
  })
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getClasses().then(setClasses).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createStudent(formData)
      router.push("/admin/students")
    } catch (err: any) {
      setError(err.message || "Failed to create student")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["school_admin"]}>
      <DashboardLayout navigation={navigation} title="Admin Panel">
        <div className="max-w-2xl">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to students
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Add New Student</h1>
            <p className="text-muted-foreground">Enroll a new student in your school</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="e.g., Jane Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="roll_number">Roll Number *</Label>
                  <Input
                    id="roll_number"
                    placeholder="e.g., 2024001"
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_id">Assign to Class *</Label>
                <select
                  id="class_id"
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - Grade {cls.grade} Section {cls.section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Parent/Guardian Information</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Parent Name</Label>
                    <Input
                      id="parent_name"
                      placeholder="e.g., John Doe"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parent_phone">Parent Phone</Label>
                      <Input
                        id="parent_phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.parent_phone}
                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parent_email">Parent Email</Label>
                      <Input
                        id="parent_email"
                        type="email"
                        placeholder="parent@email.com"
                        value={formData.parent_email}
                        onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating..." : "Create Student"}
                </Button>
                <Link href="/admin/students" className="flex-1">
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
