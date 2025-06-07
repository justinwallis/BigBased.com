"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireCMSPermission } from "@/lib/cms-access-control"

export interface CMSRedirect {
  id: string
  source_path: string
  destination_path: string
  redirect_type: number
  is_active: boolean
  is_regex: boolean
  description?: string
  hit_count: number
  last_hit_at?: string
  created_at: string
  updated_at: string
  created_by?: string
  expires_at?: string
}

export async function createRedirect(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check permissions
    await requireCMSPermission(user.id, "redirects", "manage")

    const source_path = formData.get("source_path") as string
    const destination_path = formData.get("destination_path") as string
    const redirect_type = Number.parseInt(formData.get("redirect_type") as string) || 301
    const is_regex = formData.get("is_regex") === "true"
    const description = formData.get("description") as string
    const expires_at = formData.get("expires_at") as string

    const { data, error } = await supabase
      .from("cms_redirects")
      .insert({
        source_path,
        destination_path,
        redirect_type,
        is_regex,
        description,
        expires_at: expires_at || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms/redirects")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getRedirects() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("cms_redirects").select("*").order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateRedirect(id: string, formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check permissions
    await requireCMSPermission(user.id, "redirects", "manage")

    const source_path = formData.get("source_path") as string
    const destination_path = formData.get("destination_path") as string
    const redirect_type = Number.parseInt(formData.get("redirect_type") as string) || 301
    const is_active = formData.get("is_active") === "true"
    const is_regex = formData.get("is_regex") === "true"
    const description = formData.get("description") as string
    const expires_at = formData.get("expires_at") as string

    const { data, error } = await supabase
      .from("cms_redirects")
      .update({
        source_path,
        destination_path,
        redirect_type,
        is_active,
        is_regex,
        description,
        expires_at: expires_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms/redirects")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteRedirect(id: string) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check permissions
    await requireCMSPermission(user.id, "redirects", "manage")

    const { error } = await supabase.from("cms_redirects").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms/redirects")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function incrementRedirectHit(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("cms_redirects")
      .update({
        hit_count: supabase.rpc("increment_hit_count", { redirect_id: id }),
        last_hit_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error incrementing redirect hit:", error)
    }
  } catch (error) {
    console.error("Error incrementing redirect hit:", error)
  }
}

// Function to find matching redirect
export async function findRedirect(path: string): Promise<CMSRedirect | null> {
  try {
    const supabase = createClient()

    // First try exact match
    const { data: exactMatch } = await supabase
      .from("cms_redirects")
      .select("*")
      .eq("source_path", path)
      .eq("is_active", true)
      .eq("is_regex", false)
      .single()

    if (exactMatch) {
      return exactMatch
    }

    // Then try regex matches
    const { data: regexRedirects } = await supabase
      .from("cms_redirects")
      .select("*")
      .eq("is_active", true)
      .eq("is_regex", true)

    if (regexRedirects) {
      for (const redirect of regexRedirects) {
        try {
          const regex = new RegExp(redirect.source_path)
          if (regex.test(path)) {
            return redirect
          }
        } catch (error) {
          console.error("Invalid regex pattern:", redirect.source_path)
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error finding redirect:", error)
    return null
  }
}
