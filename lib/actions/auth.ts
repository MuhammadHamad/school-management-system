"use server"

import { createClient } from "@/lib/supabase/server"

export async function registerSchool(formData: {
  schoolName: string
  adminName: string
  email: string
  phone: string
  password: string
  plan: string
  address?: string
}) {
  const supabase = await createClient()

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/admin/dashboard`,
        data: {
          full_name: formData.adminName,
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("Failed to create user")

    // Create school record
    const { data: schoolData, error: schoolError } = await supabase
      .from("schools")
      .insert({
        name: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || "",
        plan: formData.plan,
        status: "trial",
        max_teachers: formData.plan === "starter" ? 5 : formData.plan === "professional" ? 20 : 999,
        max_students: formData.plan === "starter" ? 100 : formData.plan === "professional" ? 500 : 9999,
      })
      .select()
      .single()

    if (schoolError) throw schoolError

    // Create admin profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.adminName,
      role: "school_admin",
      school_id: schoolData.id,
    })

    if (profileError) throw profileError

    return { success: true, message: "Registration successful! Please check your email to verify your account." }
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return { success: false, message: error.message || "Registration failed. Please try again." }
  }
}
