"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export type UserRole = "school_admin" | "teacher" | "saas_owner"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

    if (error || !profile) {
      console.error("[v0] Error fetching profile:", error)
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.role as UserRole,
      schoolId: profile.school_id,
    }
  }

  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      const userProfile = await fetchUserProfile(authUser)
      setUser(userProfile)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        const userProfile = await fetchUserProfile(authUser)
        setUser(userProfile)
      }

      setLoading(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user)
        setUser(userProfile)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
