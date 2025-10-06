"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTeachers() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile) throw new Error("Profile not found")

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      classes:classes!classes_teacher_id_fkey(id, name, grade, section)
    `)
    .eq("school_id", profile.school_id)
    .eq("role", "teacher")
    .order("full_name")

  if (error) throw error
  return data
}

export async function createTeacher(formData: {
  email: string
  full_name: string
  phone?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("school_id, role").eq("id", user.id).single()

  if (!profile || profile.role !== "school_admin") {
    throw new Error("Only school admins can create teachers")
  }

  // Create auth user with temporary password
  const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!"

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: tempPassword,
    email_confirm: true,
  })

  if (authError) throw authError

  // Create profile
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.full_name,
      phone: formData.phone,
      role: "teacher",
      school_id: profile.school_id,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/teachers")
  return { ...data, tempPassword }
}

export async function updateTeacher(
  id: string,
  formData: {
    full_name?: string
    phone?: string
    email?: string
  },
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase.from("profiles").update(formData).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/teachers")
  return data
}

export async function deleteTeacher(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Delete auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(id)
  if (authError) throw authError

  // Profile will be deleted via CASCADE

  revalidatePath("/admin/teachers")
}
