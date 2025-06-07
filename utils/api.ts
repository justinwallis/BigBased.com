/**
 * API utility functions for user management and other operations
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserAccount {
  id: string
  email: string
  username?: string
  role?: string
  created_at?: string
  updated_at?: string
}

export interface RestoreAccountData {
  email: string
  password?: string
  sendEmail?: boolean
}

/**
 * Delete a user account (auth only, keeping profile as orphaned)
 */
export async function deleteUserAccount(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/admin/users/delete-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: "User account deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user account",
    }
  }
}

/**
 * Restore a user account by creating new auth for orphaned profile
 */
export async function restoreUserAccount(
  profileId: string,
  restoreData: RestoreAccountData,
): Promise<ApiResponse<{ tempPassword?: string }>> {
  try {
    const response = await fetch("/api/admin/users/restore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId,
        ...restoreData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: "User account restored successfully",
    }
  } catch (error) {
    console.error("Error restoring user account:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to restore user account",
    }
  }
}

/**
 * Fetch user data with auth status
 */
export async function fetchUsers(): Promise<ApiResponse<UserAccount[]>> {
  try {
    const response = await fetch("/api/admin/users")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result.users || [],
      message: "Users fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
      data: [],
    }
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/admin/users/update-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: "User role updated successfully",
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user role",
    }
  }
}

/**
 * Delete user profile completely
 */
export async function deleteUserProfile(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/admin/users/delete-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: "User profile deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user profile",
    }
  }
}

/**
 * Generic API request helper
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "API request failed",
    }
  }
}

/**
 * Check if user has admin permissions
 */
export async function checkAdminPermissions(): Promise<ApiResponse<{ isAdmin: boolean }>> {
  try {
    const response = await fetch("/api/admin/check-permissions")

    if (!response.ok) {
      return {
        success: false,
        error: "Not authorized",
        data: { isAdmin: false },
      }
    }

    const result = await response.json()
    return {
      success: true,
      data: { isAdmin: result.isAdmin || false },
    }
  } catch (error) {
    console.error("Error checking admin permissions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check permissions",
      data: { isAdmin: false },
    }
  }
}
