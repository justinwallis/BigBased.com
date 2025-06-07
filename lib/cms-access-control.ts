import { createClient } from "@/lib/supabase/server"

export interface CMSRole {
  id: string
  name: string
  description?: string
  permissions: Record<string, string[]>
  is_system_role: boolean
}

export interface CMSPermission {
  resource: string
  action: string
}

export class CMSAccessControl {
  private supabase = createClient()

  async getUserRoles(userId: string): Promise<CMSRole[]> {
    const { data, error } = await this.supabase
      .from("cms_user_roles")
      .select(`
        cms_roles (*)
      `)
      .eq("user_id", userId)
      .eq("cms_roles.is_active", true)

    if (error) throw error
    return data?.map((item: any) => item.cms_roles) || []
  }

  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(userId)

      return roles.some((role) => {
        const resourcePermissions = role.permissions[resource]
        return resourcePermissions && resourcePermissions.includes(action)
      })
    } catch (error) {
      console.error("Error checking permission:", error)
      return false
    }
  }

  async assignRole(userId: string, roleId: string, grantedBy: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("cms_user_roles").insert({
        user_id: userId,
        role_id: roleId,
        granted_by: grantedBy,
      })

      return !error
    } catch (error) {
      console.error("Error assigning role:", error)
      return false
    }
  }

  async removeRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("cms_user_roles").delete().eq("user_id", userId).eq("role_id", roleId)

      return !error
    } catch (error) {
      console.error("Error removing role:", error)
      return false
    }
  }

  async createRole(name: string, description: string, permissions: Record<string, string[]>): Promise<CMSRole | null> {
    try {
      const { data, error } = await this.supabase
        .from("cms_roles")
        .insert({
          name,
          description,
          permissions,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating role:", error)
      return null
    }
  }

  async getAllRoles(): Promise<CMSRole[]> {
    const { data, error } = await this.supabase.from("cms_roles").select("*").order("name")

    if (error) throw error
    return data || []
  }
}

// Middleware function to check CMS permissions
export async function requireCMSPermission(userId: string, resource: string, action: string) {
  const accessControl = new CMSAccessControl()
  const hasPermission = await accessControl.hasPermission(userId, resource, action)

  if (!hasPermission) {
    throw new Error(`Access denied: Missing permission ${resource}:${action}`)
  }

  return true
}

// Helper function to check if user is CMS admin
export async function isCMSAdmin(userId: string): Promise<boolean> {
  const accessControl = new CMSAccessControl()
  return await accessControl.hasPermission(userId, "settings", "manage")
}
