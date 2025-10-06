"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAttendanceByDate(classId: string, date: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("attendance_records")
    .select(`
      *,
      student:students(*)
    `)
    .eq("class_id", classId)
    .eq("date", date)

  if (error) throw error
  return data
}

export async function markAttendance(
  records: Array<{
    student_id: string
    class_id: string
    date: string
    status: "present" | "absent" | "late" | "excused"
  }>,
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("id, role").eq("id", user.id).single()

  if (!profile || profile.role !== "teacher") {
    throw new Error("Only teachers can mark attendance")
  }

  // Add marked_by to each record
  const recordsWithTeacher = records.map((record) => ({
    ...record,
    marked_by: user.id,
  }))

  const { data, error } = await supabase
    .from("attendance_records")
    .upsert(recordsWithTeacher, {
      onConflict: "student_id,date",
    })
    .select()

  if (error) throw error

  revalidatePath("/teacher/attendance")
  return data
}

export async function getAttendanceStats(schoolId: string, startDate?: string, endDate?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase.from("attendance_records").select("status, date, class_id").eq("school_id", schoolId)

  if (startDate) query = query.gte("date", startDate)
  if (endDate) query = query.lte("date", endDate)

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getStudentAttendanceReport(studentId: string, startDate?: string, endDate?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false })

  if (startDate) query = query.gte("date", startDate)
  if (endDate) query = query.lte("date", endDate)

  const { data, error } = await query

  if (error) throw error
  return data
}
