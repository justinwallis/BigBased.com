"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Types
export interface ContentType {
  id: string
  name: string
  slug: string
  description?: string
  schema: any
  settings: any
  created_at: string
  updated_at: string
  created_by?: string
}

export interface ContentItem {
  id: string
  content_type_id: string
  title: string
  slug: string
  content: any
  status: "draft" | "published" | "archived"
  published_at?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  featured_image_url?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface MediaFile {
  id: string
  folder_id?: string
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  metadata: any
  created_at: string
  created_by?: string
}

// Content Types Management
export async function createContentType(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const schema = JSON.parse((formData.get("schema") as string) || "{}")
    const settings = JSON.parse((formData.get("settings") as string) || "{}")

    const { data, error } = await supabase
      .from("content_types")
      .insert({
        name,
        slug,
        description,
        schema,
        settings,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getContentTypes() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("content_types").select("*").order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateContentType(id: string, formData: FormData) {
  try {
    const supabase = createClient()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const schema = JSON.parse((formData.get("schema") as string) || "{}")
    const settings = JSON.parse((formData.get("settings") as string) || "{}")

    const { data, error } = await supabase
      .from("content_types")
      .update({
        name,
        description,
        schema,
        settings,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteContentType(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("content_types").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Content Items Management
export async function createContentItem(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const content_type_id = formData.get("content_type_id") as string
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const content = JSON.parse((formData.get("content") as string) || "{}")
    const status = (formData.get("status") as string) || "draft"
    const seo_title = formData.get("seo_title") as string
    const seo_description = formData.get("seo_description") as string
    const seo_keywords = formData.get("seo_keywords") as string

    const { data, error } = await supabase
      .from("content_items")
      .insert({
        content_type_id,
        title,
        slug,
        content,
        status,
        seo_title,
        seo_description,
        seo_keywords: seo_keywords ? seo_keywords.split(",").map((k) => k.trim()) : [],
        published_at: status === "published" ? new Date().toISOString() : null,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Create initial version
    await supabase.from("content_versions").insert({
      content_item_id: data.id,
      version_number: 1,
      title,
      content,
      seo_title,
      seo_description,
      seo_keywords: seo_keywords ? seo_keywords.split(",").map((k) => k.trim()) : [],
      created_by: user.id,
      change_summary: "Initial version",
    })

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getContentItems(contentTypeId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("content_items")
      .select(`
        *,
        content_types(name, slug)
      `)
      .order("updated_at", { ascending: false })

    if (contentTypeId) {
      query = query.eq("content_type_id", contentTypeId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateContentItem(id: string, formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get current item for versioning
    const { data: currentItem } = await supabase.from("content_items").select("*").eq("id", id).single()

    if (!currentItem) {
      return { success: false, error: "Content item not found" }
    }

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const content = JSON.parse((formData.get("content") as string) || "{}")
    const status = formData.get("status") as string
    const seo_title = formData.get("seo_title") as string
    const seo_description = formData.get("seo_description") as string
    const seo_keywords = formData.get("seo_keywords") as string
    const change_summary = (formData.get("change_summary") as string) || "Updated content"

    // Get next version number
    const { data: lastVersion } = await supabase
      .from("content_versions")
      .select("version_number")
      .eq("content_item_id", id)
      .order("version_number", { ascending: false })
      .limit(1)
      .single()

    const nextVersion = (lastVersion?.version_number || 0) + 1

    // Update the content item
    const { data, error } = await supabase
      .from("content_items")
      .update({
        title,
        slug,
        content,
        status,
        seo_title,
        seo_description,
        seo_keywords: seo_keywords ? seo_keywords.split(",").map((k) => k.trim()) : [],
        published_at:
          status === "published" && currentItem.status !== "published"
            ? new Date().toISOString()
            : currentItem.published_at,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Create new version
    await supabase.from("content_versions").insert({
      content_item_id: id,
      version_number: nextVersion,
      title,
      content,
      seo_title,
      seo_description,
      seo_keywords: seo_keywords ? seo_keywords.split(",").map((k) => k.trim()) : [],
      created_by: user.id,
      change_summary,
    })

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteContentItem(id: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("content_items").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Media Management
export async function getMediaFiles(folderId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("media_files")
      .select(`
        *,
        media_folders(name, path)
      `)
      .order("created_at", { ascending: false })

    if (folderId) {
      query = query.eq("folder_id", folderId)
    } else {
      query = query.is("folder_id", null)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getMediaFolders(parentId?: string) {
  try {
    const supabase = createClient()

    let query = supabase.from("media_folders").select("*").order("name")

    if (parentId) {
      query = query.eq("parent_id", parentId)
    } else {
      query = query.is("parent_id", null)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Content Versions
export async function getContentVersions(contentItemId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("content_versions")
      .select(`
        *,
        profiles:created_by(username, full_name)
      `)
      .eq("content_item_id", contentItemId)
      .order("version_number", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function restoreContentVersion(contentItemId: string, versionNumber: number) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get the version to restore
    const { data: version, error: versionError } = await supabase
      .from("content_versions")
      .select("*")
      .eq("content_item_id", contentItemId)
      .eq("version_number", versionNumber)
      .single()

    if (versionError || !version) {
      return { success: false, error: "Version not found" }
    }

    // Update the content item with the version data
    const { data, error } = await supabase
      .from("content_items")
      .update({
        title: version.title,
        content: version.content,
        seo_title: version.seo_title,
        seo_description: version.seo_description,
        seo_keywords: version.seo_keywords,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contentItemId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Create a new version for this restoration
    const { data: lastVersion } = await supabase
      .from("content_versions")
      .select("version_number")
      .eq("content_item_id", contentItemId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single()

    const nextVersion = (lastVersion?.version_number || 0) + 1

    await supabase.from("content_versions").insert({
      content_item_id: contentItemId,
      version_number: nextVersion,
      title: version.title,
      content: version.content,
      seo_title: version.seo_title,
      seo_description: version.seo_description,
      seo_keywords: version.seo_keywords,
      created_by: user.id,
      change_summary: `Restored from version ${versionNumber}`,
    })

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
