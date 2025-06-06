"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface BulkImportResult {
  success: boolean
  totalProcessed: number
  successCount: number
  errorCount: number
  errors: Array<{ domain: string; error: string }>
  duplicates: string[]
}

export async function bulkImportDomains(domainsText: string): Promise<BulkImportResult> {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error("Not authenticated")
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      throw new Error("Not authorized")
    }

    // Parse domains from text (CSV or line-separated)
    const lines = domainsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    // Skip header if it looks like CSV
    const domains = lines[0].toLowerCase().includes("domain") ? lines.slice(1) : lines

    // Clean and validate domains
    const cleanDomains = domains
      .map((line) => {
        // Remove quotes and extra whitespace
        const domain = line.replace(/[",]/g, "").trim().toLowerCase()
        return domain
      })
      .filter((domain) => {
        // Basic domain validation
        return domain && domain.includes(".") && !domain.includes(" ") && domain.length > 3 && domain.length < 255
      })

    console.log(`Processing ${cleanDomains.length} domains for bulk import`)

    const result: BulkImportResult = {
      success: true,
      totalProcessed: cleanDomains.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
      duplicates: [],
    }

    // Check for existing domains first
    const { data: existingDomains } = await supabase.from("domains").select("domain").in("domain", cleanDomains)

    const existingDomainSet = new Set(existingDomains?.map((d) => d.domain) || [])

    // Filter out duplicates
    const newDomains = cleanDomains.filter((domain) => {
      if (existingDomainSet.has(domain)) {
        result.duplicates.push(domain)
        return false
      }
      return true
    })

    console.log(`${newDomains.length} new domains to import (${result.duplicates.length} duplicates skipped)`)

    // Default settings for bulk imported domains
    const defaultSettings = {
      features: {
        enhanced_domains: false,
        custom_branding: false,
        analytics: false,
      },
    }

    // Process domains in batches to avoid overwhelming the database
    const batchSize = 50
    for (let i = 0; i < newDomains.length; i += batchSize) {
      const batch = newDomains.slice(i, i + batchSize)

      const domainRecords = batch.map((domain) => ({
        domain,
        is_active: true,
        owner_user_id: null,
        custom_branding: defaultSettings,
      }))

      try {
        const { data, error } = await supabase.from("domains").insert(domainRecords).select()

        if (error) {
          console.error(`Batch ${i / batchSize + 1} error:`, error)
          // Add all domains in this batch to errors
          batch.forEach((domain) => {
            result.errors.push({ domain, error: error.message })
            result.errorCount++
          })
        } else {
          result.successCount += data.length
          console.log(`Batch ${i / batchSize + 1} completed: ${data.length} domains imported`)
        }
      } catch (batchError: any) {
        console.error(`Batch ${i / batchSize + 1} exception:`, batchError)
        batch.forEach((domain) => {
          result.errors.push({ domain, error: batchError.message })
          result.errorCount++
        })
      }

      // Small delay between batches to be nice to the database
      if (i + batchSize < newDomains.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    console.log(
      `Bulk import completed: ${result.successCount} success, ${result.errorCount} errors, ${result.duplicates.length} duplicates`,
    )

    revalidatePath("/admin/domains")
    return result
  } catch (error: any) {
    console.error("Error in bulkImportDomains:", error)
    return {
      success: false,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: [{ domain: "bulk_import", error: error.message }],
      duplicates: [],
    }
  }
}

export async function importFromCsvUrl(csvUrl: string): Promise<BulkImportResult> {
  try {
    console.log("Fetching CSV from URL:", csvUrl)
    const response = await fetch(csvUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("CSV fetched, size:", csvText.length, "characters")

    return await bulkImportDomains(csvText)
  } catch (error: any) {
    console.error("Error importing from CSV URL:", error)
    return {
      success: false,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: [{ domain: "csv_import", error: error.message }],
      duplicates: [],
    }
  }
}
