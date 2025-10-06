"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  // Get counts
  const [classesResult, teachersResult, studentsResult] = await Promise.all([
    supabase.from("classes").select("id", { count: "exact", head: true }).eq("school_id", profile.school_id),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("school_id", profile.school_id)
      .eq("role", "teacher"),
    supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", profile.school_id),
  ])

  // Get today's attendance
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAttendance } = await supabase
    .from("attendance_records")
    .select("status")
    .eq("school_id", profile.school_id)
    .eq("date", today)

  const totalPresent = todayAttendance?.filter((a) => a.status === "present").length || 0
  const totalRecords = todayAttendance?.length || 0
  const attendanceRate = totalRecords > 0 ? (totalPresent / totalRecords) * 100 : 0

  return {
    totalClasses: classesResult.count || 0,
    totalTeachers: teachersResult.count || 0,
    totalStudents: studentsResult.count || 0,
    attendanceRate: Math.round(attendanceRate),
  }
}

export async function getOwnerDashboardStats() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "saas_owner") {
    throw new Error("Only SaaS owners can access this data")
  }

  // Get all schools with counts
  const { data: schools } = await supabase
    .from("schools")
    .select(`
      *,
      students:students(count),
      classes:classes(count),
      teachers:profiles!profiles_school_id_fkey(count)
    `)
    .order("created_at", { ascending: false })

  return schools || []
}
