"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies, headers } from "next/headers"
import { randomBytes, createHash } from "crypto"
import { logAuthEvent, AUTH_EVENTS, AUTH_STATUS } from "./auth-log-actions"

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  return { userId: session.user.id, supabase }
}

// Get recovery methods for the current user
export async function getUserRecoveryMethods() {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Get all recovery methods
    const { data: methods, error } = await supabase
      .from("recovery_methods")
      .select("id, method_type, is_verified, is_primary, created_at, updated_at")
      .eq("user_id", userId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) throw error

    // Get details for each method
    const methodsWithDetails = await Promise.all(
      methods.map(async (method) => {
        if (method.method_type === "security_questions") {
          const { data: questions, error: questionsError } = await supabase
            .from("security_questions")
            .select("id, question_text")
            .eq("recovery_method_id", method.id)

          if (questionsError) throw questionsError

          return {
            ...method,
            details: {
              questions: questions || [],
            },
          }
        } else if (method.method_type === "recovery_email") {
          const { data: emails, error: emailsError } = await supabase
            .from("recovery_emails")
            .select("id, email")
            .eq("recovery_method_id", method.id)

          if (emailsError) throw emailsError

          return {
            ...method,
            details: {
              email: emails && emails.length > 0 ? emails[0].email : null,
            },
          }
        } else if (method.method_type === "phone_number") {
          const { data: phones, error: phonesError } = await supabase
            .from("recovery_phone_numbers")
            .select("id, phone_number")
            .eq("recovery_method_id", method.id)

          if (phonesError) throw phonesError

          return {
            ...method,
            details: {
              phone_number: phones && phones.length > 0 ? phones[0].phone_number : null,
            },
          }
        }

        return { ...method, details: {} }
      }),
    )

    return {
      success: true,
      data: methodsWithDetails,
    }
  } catch (error) {
    console.error("Error getting recovery methods:", error)
    return {
      success: false,
      error: "Failed to get recovery methods",
    }
  }
}

// Add security questions recovery method
export async function addSecurityQuestions(questions: { question: string; answer: string }[]) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Check if we already have security questions
    const { data: existingMethods, error: checkError } = await supabase
      .from("recovery_methods")
      .select("id")
      .eq("user_id", userId)
      .eq("method_type", "security_questions")

    if (checkError) throw checkError

    let recoveryMethodId: number

    // If we already have a method, use that
    if (existingMethods && existingMethods.length > 0) {
      recoveryMethodId = existingMethods[0].id

      // Delete existing questions
      await supabase.from("security_questions").delete().eq("recovery_method_id", recoveryMethodId)
    } else {
      // Create a new recovery method
      const { data: newMethod, error: methodError } = await supabase
        .from("recovery_methods")
        .insert({
          user_id: userId,
          method_type: "security_questions",
          is_verified: true, // Security questions are verified immediately
          is_primary: false,
        })
        .select("id")
        .single()

      if (methodError) throw methodError
      recoveryMethodId = newMethod.id
    }

    // Insert the questions
    const questionsToInsert = await Promise.all(
      questions.map(async (q) => ({
        recovery_method_id: recoveryMethodId,
        question_text: q.question,
        answer_hash: await hashSecurityAnswer(q.answer),
      })),
    )

    const { error: insertError } = await supabase.from("security_questions").insert(questionsToInsert)

    if (insertError) throw insertError

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.RECOVERY_METHOD_ADDED, AUTH_STATUS.SUCCESS, {
      method_type: "security_questions",
      questions_count: questions.length,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error adding security questions:", error)
    return {
      success: false,
      error: "Failed to add security questions",
    }
  }
}

// Add recovery email
export async function addRecoveryEmail(email: string) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Check if we already have a recovery email
    const { data: existingMethods, error: checkError } = await supabase
      .from("recovery_methods")
      .select("id")
      .eq("user_id", userId)
      .eq("method_type", "recovery_email")

    if (checkError) throw checkError

    let recoveryMethodId: number

    // If we already have a method, use that
    if (existingMethods && existingMethods.length > 0) {
      recoveryMethodId = existingMethods[0].id

      // Delete existing email
      await supabase.from("recovery_emails").delete().eq("recovery_method_id", recoveryMethodId)
    } else {
      // Create a new recovery method
      const { data: newMethod, error: methodError } = await supabase
        .from("recovery_methods")
        .insert({
          user_id: userId,
          method_type: "recovery_email",
          is_verified: false, // Email needs to be verified
          is_primary: false,
        })
        .select("id")
        .single()

      if (methodError) throw methodError
      recoveryMethodId = newMethod.id
    }

    // Insert the email
    const { error: insertError } = await supabase.from("recovery_emails").insert({
      recovery_method_id: recoveryMethodId,
      email,
    })

    if (insertError) throw insertError

    // In a real implementation, we would send a verification email here
    // For demo purposes, we'll just log the event

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.RECOVERY_METHOD_ADDED, AUTH_STATUS.SUCCESS, {
      method_type: "recovery_email",
      email,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error adding recovery email:", error)
    return {
      success: false,
      error: "Failed to add recovery email",
    }
  }
}

// Add recovery phone number
export async function addRecoveryPhone(phoneNumber: string) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Check if we already have a recovery phone
    const { data: existingMethods, error: checkError } = await supabase
      .from("recovery_methods")
      .select("id")
      .eq("user_id", userId)
      .eq("method_type", "phone_number")

    if (checkError) throw checkError

    let recoveryMethodId: number

    // If we already have a method, use that
    if (existingMethods && existingMethods.length > 0) {
      recoveryMethodId = existingMethods[0].id

      // Delete existing phone
      await supabase.from("recovery_phone_numbers").delete().eq("recovery_method_id", recoveryMethodId)
    } else {
      // Create a new recovery method
      const { data: newMethod, error: methodError } = await supabase
        .from("recovery_methods")
        .insert({
          user_id: userId,
          method_type: "phone_number",
          is_verified: false, // Phone needs to be verified
          is_primary: false,
        })
        .select("id")
        .single()

      if (methodError) throw methodError
      recoveryMethodId = newMethod.id
    }

    // Insert the phone
    const { error: insertError } = await supabase.from("recovery_phone_numbers").insert({
      recovery_method_id: recoveryMethodId,
      phone_number: phoneNumber,
    })

    if (insertError) throw insertError

    // In a real implementation, we would send a verification SMS here
    // For demo purposes, we'll just log the event

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.RECOVERY_METHOD_ADDED, AUTH_STATUS.SUCCESS, {
      method_type: "phone_number",
      phone_number: phoneNumber,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error adding recovery phone:", error)
    return {
      success: false,
      error: "Failed to add recovery phone",
    }
  }
}

// Delete recovery method
export async function deleteRecoveryMethod(methodId: number) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Check if the method belongs to the user
    const { data: method, error: checkError } = await supabase
      .from("recovery_methods")
      .select("method_type")
      .eq("id", methodId)
      .eq("user_id", userId)
      .single()

    if (checkError) throw checkError

    // Delete the method
    const { error } = await supabase.from("recovery_methods").delete().eq("id", methodId)

    if (error) throw error

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.RECOVERY_METHOD_REMOVED, AUTH_STATUS.SUCCESS, {
      method_type: method.method_type,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting recovery method:", error)
    return {
      success: false,
      error: "Failed to delete recovery method",
    }
  }
}

// Set primary recovery method
export async function setPrimaryRecoveryMethod(methodId: number) {
  try {
    const { userId, supabase } = await getAuthenticatedUser()

    // Check if the method belongs to the user
    const { data: method, error: checkError } = await supabase
      .from("recovery_methods")
      .select("method_type")
      .eq("id", methodId)
      .eq("user_id", userId)
      .single()

    if (checkError) throw checkError

    // First, unset all primary methods
    await supabase.from("recovery_methods").update({ is_primary: false }).eq("user_id", userId).eq("is_primary", true)

    // Set the new primary method
    const { error } = await supabase.from("recovery_methods").update({ is_primary: true }).eq("id", methodId)

    if (error) throw error

    // Log the event
    await logAuthEvent(userId, AUTH_EVENTS.RECOVERY_METHOD_PRIMARY_SET, AUTH_STATUS.SUCCESS, {
      method_type: method.method_type,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error setting primary recovery method:", error)
    return {
      success: false,
      error: "Failed to set primary recovery method",
    }
  }
}

// Helper function to hash security question answers
async function hashSecurityAnswer(answer: string): Promise<string> {
  // Normalize the answer: trim whitespace and convert to lowercase
  const normalizedAnswer = answer.trim().toLowerCase()

  // Hash the answer using SHA-256
  return createHash("sha256").update(normalizedAnswer).digest("hex")
}

// Initiate account recovery
export async function initiateAccountRecovery(email: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get IP and user agent for logging
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Find the user by email
    const { data: userData, error: userError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError) {
      // Don't reveal if the user exists or not
      return {
        success: true,
        message: "If an account with this email exists, recovery instructions have been sent.",
      }
    }

    const userId = userData.id

    // Get recovery methods for the user
    const { data: methods, error: methodsError } = await supabase
      .from("recovery_methods")
      .select("id, method_type, is_verified, is_primary")
      .eq("user_id", userId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false })

    if (methodsError || !methods || methods.length === 0) {
      // Log the attempt
      await logAuthEvent(userId, AUTH_EVENTS.ACCOUNT_RECOVERY_INITIATED, AUTH_STATUS.FAILURE, {
        reason: "No recovery methods found",
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      // Don't reveal if the user has recovery methods or not
      return {
        success: true,
        message: "If an account with this email exists, recovery instructions have been sent.",
      }
    }

    // Generate a recovery token
    const token = randomBytes(32).toString("hex")

    // Set expiration time (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Create a recovery request
    const { error: requestError } = await supabase.from("recovery_requests").insert({
      user_id: userId,
      request_token: token,
      recovery_method_id: methods[0].id, // Use the first method (primary if available)
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })

    if (requestError) throw requestError

    // Log the attempt
    await logAuthEvent(userId, AUTH_EVENTS.ACCOUNT_RECOVERY_INITIATED, AUTH_STATUS.SUCCESS, {
      method_type: methods[0].method_type,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // In a real implementation, we would send a recovery email here
    // For demo purposes, we'll just return the token

    return {
      success: true,
      message: "If an account with this email exists, recovery instructions have been sent.",
      // For demo purposes only, remove in production:
      debug: {
        token,
        userId,
        recoveryMethod: methods[0].method_type,
      },
    }
  } catch (error) {
    console.error("Error initiating account recovery:", error)
    return {
      success: false,
      error: "Failed to initiate account recovery",
    }
  }
}

// Verify recovery token
export async function verifyRecoveryToken(token: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get IP and user agent for logging
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Find the recovery request
    const { data: request, error: requestError } = await supabase
      .from("recovery_requests")
      .select("id, user_id, recovery_method_id, status, expires_at")
      .eq("request_token", token)
      .eq("status", "pending")
      .single()

    if (requestError || !request) {
      return {
        success: false,
        error: "Invalid or expired recovery token",
      }
    }

    // Check if the request is expired
    if (new Date(request.expires_at) < new Date()) {
      // Update the request status
      await supabase.from("recovery_requests").update({ status: "expired" }).eq("id", request.id)

      // Log the attempt
      await logAuthEvent(request.user_id, AUTH_EVENTS.ACCOUNT_RECOVERY_TOKEN_VERIFICATION, AUTH_STATUS.FAILURE, {
        reason: "Token expired",
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      return {
        success: false,
        error: "Recovery token has expired",
      }
    }

    // Get the recovery method
    const { data: method, error: methodError } = await supabase
      .from("recovery_methods")
      .select("method_type")
      .eq("id", request.recovery_method_id)
      .single()

    if (methodError) throw methodError

    // Update the request status
    await supabase.from("recovery_requests").update({ status: "verified" }).eq("id", request.id)

    // Log the attempt
    await logAuthEvent(request.user_id, AUTH_EVENTS.ACCOUNT_RECOVERY_TOKEN_VERIFICATION, AUTH_STATUS.SUCCESS, {
      method_type: method.method_type,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    return {
      success: true,
      data: {
        userId: request.user_id,
        recoveryMethodId: request.recovery_method_id,
        methodType: method.method_type,
      },
    }
  } catch (error) {
    console.error("Error verifying recovery token:", error)
    return {
      success: false,
      error: "Failed to verify recovery token",
    }
  }
}

// Get security questions for recovery
export async function getSecurityQuestions(userId: string, recoveryMethodId: number) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get the security questions
    const { data: questions, error } = await supabase
      .from("security_questions")
      .select("id, question_text")
      .eq("recovery_method_id", recoveryMethodId)

    if (error) throw error

    return {
      success: true,
      data: questions,
    }
  } catch (error) {
    console.error("Error getting security questions:", error)
    return {
      success: false,
      error: "Failed to get security questions",
    }
  }
}

// Verify security question answers
export async function verifySecurityQuestions(token: string, answers: { questionId: number; answer: string }[]) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get IP and user agent for logging
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Find the recovery request
    const { data: request, error: requestError } = await supabase
      .from("recovery_requests")
      .select("id, user_id, recovery_method_id, status, verification_attempts")
      .eq("request_token", token)
      .eq("status", "verified")
      .single()

    if (requestError || !request) {
      return {
        success: false,
        error: "Invalid recovery session",
      }
    }

    // Check if too many attempts
    if (request.verification_attempts >= 3) {
      // Update the request status
      await supabase.from("recovery_requests").update({ status: "cancelled" }).eq("id", request.id)

      // Log the attempt
      await logAuthEvent(request.user_id, AUTH_EVENTS.ACCOUNT_RECOVERY_VERIFICATION, AUTH_STATUS.FAILURE, {
        reason: "Too many attempts",
        method_type: "security_questions",
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      return {
        success: false,
        error: "Too many failed attempts. Please start a new recovery process.",
      }
    }

    // Increment the verification attempts
    await supabase
      .from("recovery_requests")
      .update({ verification_attempts: request.verification_attempts + 1 })
      .eq("id", request.id)

    // Verify each answer
    let allCorrect = true
    for (const answer of answers) {
      // Get the stored hash
      const { data: question, error: questionError } = await supabase
        .from("security_questions")
        .select("answer_hash")
        .eq("id", answer.questionId)
        .eq("recovery_method_id", request.recovery_method_id)
        .single()

      if (questionError || !question) {
        allCorrect = false
        break
      }

      // Hash the provided answer
      const hashedAnswer = await hashSecurityAnswer(answer.answer)

      // Compare the hashes
      if (hashedAnswer !== question.answer_hash) {
        allCorrect = false
        break
      }
    }

    if (!allCorrect) {
      // Log the attempt
      await logAuthEvent(request.user_id, AUTH_EVENTS.ACCOUNT_RECOVERY_VERIFICATION, AUTH_STATUS.FAILURE, {
        method_type: "security_questions",
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      return {
        success: false,
        error: "One or more answers are incorrect",
        attemptsRemaining: 3 - (request.verification_attempts + 1),
      }
    }

    // Update the request status
    await supabase
      .from("recovery_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", request.id)

    // Log the attempt
    await logAuthEvent(request.user_id, AUTH_EVENTS.ACCOUNT_RECOVERY_VERIFICATION, AUTH_STATUS.SUCCESS, {
      method_type: "security_questions",
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // Generate a password reset token
    // In a real implementation, we would use Supabase's password reset functionality
    // For demo purposes, we'll just return success

    return {
      success: true,
      message: "Security questions verified successfully",
    }
  } catch (error) {
    console.error("Error verifying security questions:", error)
    return {
      success: false,
      error: "Failed to verify security questions",
    }
  }
}

// Reset password after successful recovery
export async function resetPasswordAfterRecovery(token: string, newPassword: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get IP and user agent for logging
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Find the recovery request
    const { data: request, error: requestError } = await supabase
      .from("recovery_requests")
      .select("id, user_id, status")
      .eq("request_token", token)
      .eq("status", "completed")
      .single()

    if (requestError || !request) {
      return {
        success: false,
        error: "Invalid recovery session",
      }
    }

    // In a real implementation, we would use Supabase's password reset functionality
    // For demo purposes, we'll just log the event

    // Log the attempt
    await logAuthEvent(request.user_id, AUTH_EVENTS.PASSWORD_RESET_SUCCESS, AUTH_STATUS.SUCCESS, {
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    return {
      success: true,
      message: "Password reset successfully",
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: "Failed to reset password",
    }
  }
}
