"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Building2, TrendingUp, Search, MoreVertical, Users, GraduationCap } from "lucide-react"
import { getAllSchools, getClasses, getStudents, getTeachers } from "@/lib/mock-data"

const navigation = [
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "Schools", href: "/owner/schools", icon: Building2 },
  { name: "Analytics", href: "/owner/analytics", icon: TrendingUp },
]

export default function OwnerSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const allSchools = getAllSchools()

    // Enrich schools with stats
    const enrichedSchools = allSchools.map((school) => {
      const schoolClasses = getClasses(school.id)
      const schoolStudents = getStudents().filter((s) => schoolClasses.some((c) => c.id === s.classId))
      const schoolTeachers = getTeachers(school.id)

      return {
        ...school,
        classCount: schoolClasses.length,
        studentCount: schoolStudents.length,
        teacherCount: schoolTeachers.length,
      }
    })

    setSchools(enrichedSchools)
  }, [])

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || school.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute allowedRoles={["saas_owner"]}>
      <DashboardLayout navigation={navigation} title="SaaS Owner Panel">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Schools Management</h1>
            <p className="text-muted-foreground">Manage all schools on your platform</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Schools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
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

                <h3 className="text-xl font-semibold mb-1">{school.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{school.address}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Students
                    </span>
                    <span className="font-medium">{school.studentCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Teachers
                    </span>
                    <span className="font-medium">{school.teacherCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{school.plan}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <Card className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schools found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
