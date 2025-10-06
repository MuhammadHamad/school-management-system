"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getClasses() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  const { data, error } = await supabase
    .from("classes")
    .select(`
      *,
      teacher:profiles!classes_teacher_id_fkey(id, full_name),
      students:students(count)
    `)
    .eq("school_id", profile.school_id)
    .order("name")

  if (error) throw error
  return data
}

export async function getClassById(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("classes")
    .select(`
      *,
      teacher:profiles!classes_teacher_id_fkey(id, full_name, email),
      students:students(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createClass(formData: {
  name: string
  grade: string
  section: string
  teacher_id: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile || profile.role !== "school_admin") {
    throw new Error("Only school admins can create classes")
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({
      ...formData,
      school_id: profile.school_id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/classes")
  return data
}

export async function updateClass(
  id: string,
  formData: {
    name?: string
    grade?: string
    section?: string
    teacher_id?: string
  },
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from("classes").update(formData).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/classes")
  return data
}

export async function deleteClass(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("classes").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/classes")
}
