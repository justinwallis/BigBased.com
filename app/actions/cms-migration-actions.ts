"use server"

import { createClient } from "@/lib/supabase/server"
import { requireCMSPermission } from "@/lib/cms-access-control"
import { CMSErrorTracker } from "@/lib/sentry"

export interface MigrationJob {
  id: string
  name: string
  type: "import" | "export" | "backup" | "restore"
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  total_items: number
  processed_items: number
  error_message?: string
  metadata: Record<string, any>
  created_at: string
  completed_at?: string
  created_by: string
}

export async function createExportJob(options: {
  name: string
  content_types?: string[]
  include_media?: boolean
  date_range?: { start: string; end: string }
}) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "content", "export")

    // Create migration job
    const { data, error } = await supabase
      .from("cms_migration_jobs")
      .insert({
        name: options.name,
        type: "export",
        status: "pending",
        metadata: options,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Start export process (in a real app, this would be a background job)
    processExportJob(data.id, options)

    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("create_export_job", "new", error)
    return { success: false, error: error.message }
  }
}

async function processExportJob(jobId: string, options: any) {
  const supabase = createClient()

  try {
    // Update job status
    await supabase.from("cms_migration_jobs").update({ status: "running" }).eq("id", jobId)

    // Build export query
    let query = supabase.from("content_items").select(`
      *,
      content_types(*)
    `)

    if (options.content_types?.length) {
      query = query.in("content_type_id", options.content_types)
    }

    if (options.date_range) {
      query = query.gte("created_at", options.date_range.start).lte("created_at", options.date_range.end)
    }

    const { data: content, error } = await query

    if (error) throw error

    const exportData: any = { content }

    // Include media if requested
    if (options.include_media) {
      const { data: media } = await supabase.from("media_files").select("*")
      exportData.media = media
    }

    // Include content types
    const { data: contentTypes } = await supabase.from("content_types").select("*")
    exportData.content_types = contentTypes

    // Create export file (in production, save to cloud storage)
    const exportJson = JSON.stringify(exportData, null, 2)
    const filename = `export_${new Date().toISOString().split("T")[0]}_${jobId}.json`

    // Update job with completion
    await supabase
      .from("cms_migration_jobs")
      .update({
        status: "completed",
        progress: 100,
        total_items: content?.length || 0,
        processed_items: content?.length || 0,
        completed_at: new Date().toISOString(),
        metadata: {
          ...options,
          filename,
          file_size: exportJson.length,
        },
      })
      .eq("id", jobId)
  } catch (error: any) {
    await supabase
      .from("cms_migration_jobs")
      .update({
        status: "failed",
        error_message: error.message,
      })
      .eq("id", jobId)

    CMSErrorTracker.trackContentError("process_export_job", jobId, error)
  }
}

export async function createImportJob(file: File, options: { merge_strategy: "replace" | "merge" | "skip" }) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "content", "import")

    // Parse import file
    const fileContent = await file.text()
    const importData = JSON.parse(fileContent)

    // Validate import data structure
    if (!importData.content || !Array.isArray(importData.content)) {
      return { success: false, error: "Invalid import file format" }
    }

    // Create migration job
    const { data, error } = await supabase
      .from("cms_migration_jobs")
      .insert({
        name: `Import from ${file.name}`,
        type: "import",
        status: "pending",
        total_items: importData.content.length,
        metadata: {
          ...options,
          filename: file.name,
          file_size: file.size,
        },
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Start import process
    processImportJob(data.id, importData, options)

    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("create_import_job", "new", error)
    return { success: false, error: error.message }
  }
}

async function processImportJob(jobId: string, importData: any, options: any) {
  const supabase = createClient()

  try {
    await supabase.from("cms_migration_jobs").update({ status: "running" }).eq("id", jobId)

    let processedItems = 0
    const totalItems = importData.content.length

    // Import content types first
    if (importData.content_types) {
      for (const contentType of importData.content_types) {
        const { error } = await supabase.from("content_types").upsert(contentType, { onConflict: "slug" })

        if (error && options.merge_strategy !== "skip") {
          throw error
        }
      }
    }

    // Import content items
    for (const item of importData.content) {
      try {
        if (options.merge_strategy === "replace") {
          await supabase.from("content_items").upsert(item, { onConflict: "slug" })
        } else if (options.merge_strategy === "merge") {
          const { data: existing } = await supabase.from("content_items").select("id").eq("slug", item.slug).single()

          if (existing) {
            await supabase.from("content_items").update(item).eq("id", existing.id)
          } else {
            await supabase.from("content_items").insert(item)
          }
        } else {
          // Skip existing
          const { data: existing } = await supabase.from("content_items").select("id").eq("slug", item.slug).single()

          if (!existing) {
            await supabase.from("content_items").insert(item)
          }
        }

        processedItems++

        // Update progress
        const progress = Math.round((processedItems / totalItems) * 100)
        await supabase
          .from("cms_migration_jobs")
          .update({
            progress,
            processed_items: processedItems,
          })
          .eq("id", jobId)
      } catch (itemError: any) {
        console.error(`Error importing item ${item.slug}:`, itemError)
        // Continue with other items
      }
    }

    // Complete job
    await supabase
      .from("cms_migration_jobs")
      .update({
        status: "completed",
        progress: 100,
        processed_items: processedItems,
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId)
  } catch (error: any) {
    await supabase
      .from("cms_migration_jobs")
      .update({
        status: "failed",
        error_message: error.message,
      })
      .eq("id", jobId)

    CMSErrorTracker.trackContentError("process_import_job", jobId, error)
  }
}

export async function getMigrationJobs() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("cms_migration_jobs")
      .select(`
        *,
        profiles:created_by(username, full_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMigrationJob(jobId: string) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "settings", "manage")

    const { error } = await supabase.from("cms_migration_jobs").delete().eq("id", jobId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
