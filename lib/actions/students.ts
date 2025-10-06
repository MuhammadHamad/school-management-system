"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getStudents(classId?: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  let query = supabase
    .from("students")
    .select(`
      *,
      class:classes(id, name, grade, section)
    `)
    .eq("school_id", profile.school_id)
    .order("full_name")

  if (classId) {
    query = query.eq("class_id", classId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createStudent(formData: {
  full_name: string
  roll_number: string
  class_id: string
  date_of_birth?: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile || profile.role !== "school_admin") {
    throw new Error("Only school admins can create students")
  }

  const { data, error } = await supabase
    .from("students")
    .insert({
      ...formData,
      school_id: profile.school_id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/students")
  return data
}

export async function updateStudent(
  id: string,
  formData: {
    full_name?: string
    roll_number?: string
    class_id?: string
    date_of_birth?: string
    parent_name?: string
    parent_phone?: string
    parent_email?: string
  },
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from("students").update(formData).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/students")
  return data
}

export async function deleteStudent(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/students")
}
