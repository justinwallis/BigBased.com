"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { validatePassword } from "@/lib/password-validation"

export async function changePassword(formData: FormData) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("User error:", userError)
      return { error: "Not authenticated" }
    }

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All fields are required" }
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" }
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return { error: passwordValidation.message }
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return { error: "New password must be different from current password" }
    }

    // Create a client-side supabase instance for password verification
    const clientSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Verify current password by attempting to sign in
    const { error: signInError } = await clientSupabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return { error: "Current password is incorrect" }
    }

    // Update password using the service role client
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })

    if (updateError) {
      console.error("Update error:", updateError)
      return { error: "Failed to update password. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("Password change error:", error)
    return { error: "An unexpected error occurred" }
  }
}
