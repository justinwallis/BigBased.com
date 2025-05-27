"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { validatePassword } from "@/lib/password-validation"

export async function changePassword(formData: FormData) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
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

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return { error: "Current password is incorrect" }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return { error: "Failed to update password. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("Password change error:", error)
    return { error: "An unexpected error occurred" }
  }
}
