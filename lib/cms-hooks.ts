import { createClient } from "@/lib/supabase/server"

export interface CMSHook {
  id: string
  name: string
  event_type: string
  endpoint_url?: string
  http_method: string
  headers: Record<string, string>
  payload_template: Record<string, any>
  is_active: boolean
  retry_count: number
  timeout_seconds: number
}

export interface HookExecution {
  id: string
  hook_id: string
  event_data: Record<string, any>
  status: "pending" | "success" | "failed" | "retrying"
  response_status?: number
  response_body?: string
  error_message?: string
  execution_time_ms?: number
  retry_attempt: number
}

export class CMSHooksManager {
  private supabase = createClient()

  async triggerHooks(eventType: string, eventData: Record<string, any>) {
    try {
      // Get all active hooks for this event type
      const { data: hooks, error } = await this.supabase
        .from("cms_hooks")
        .select("*")
        .eq("event_type", eventType)
        .eq("is_active", true)

      if (error) throw error

      // Execute each hook
      for (const hook of hooks || []) {
        await this.executeHook(hook, eventData)
      }
    } catch (error) {
      console.error("Error triggering hooks:", error)
    }
  }

  private async executeHook(hook: CMSHook, eventData: Record<string, any>) {
    const startTime = Date.now()

    try {
      // Log the execution attempt
      const { data: execution } = await this.supabase
        .from("cms_hook_executions")
        .insert({
          hook_id: hook.id,
          event_data: eventData,
          status: "pending",
        })
        .select()
        .single()

      if (!execution) return

      // Prepare payload using template
      const payload = this.processPayloadTemplate(hook.payload_template, eventData)

      // Make HTTP request if endpoint is configured
      if (hook.endpoint_url) {
        const response = await fetch(hook.endpoint_url, {
          method: hook.http_method,
          headers: {
            "Content-Type": "application/json",
            ...hook.headers,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(hook.timeout_seconds * 1000),
        })

        const responseBody = await response.text()
        const executionTime = Date.now() - startTime

        // Update execution log
        await this.supabase
          .from("cms_hook_executions")
          .update({
            status: response.ok ? "success" : "failed",
            response_status: response.status,
            response_body: responseBody,
            execution_time_ms: executionTime,
            error_message: response.ok ? null : `HTTP ${response.status}: ${responseBody}`,
          })
          .eq("id", execution.id)

        // Schedule retry if failed
        if (!response.ok && execution.retry_attempt < hook.retry_count) {
          await this.scheduleRetry(execution.id, hook, eventData, execution.retry_attempt + 1)
        }
      }
    } catch (error: any) {
      const executionTime = Date.now() - startTime

      // Update execution log with error
      await this.supabase
        .from("cms_hook_executions")
        .update({
          status: "failed",
          execution_time_ms: executionTime,
          error_message: error.message,
        })
        .eq("hook_id", hook.id)
        .eq("status", "pending")
    }
  }

  private processPayloadTemplate(template: Record<string, any>, eventData: Record<string, any>): Record<string, any> {
    const processValue = (value: any): any => {
      if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
        const path = value.slice(2, -2).trim()
        return this.getNestedValue(eventData, path) || value
      }

      if (typeof value === "object" && value !== null) {
        const result: Record<string, any> = {}
        for (const [key, val] of Object.entries(value)) {
          result[key] = processValue(val)
        }
        return result
      }

      return value
    }

    return processValue(template)
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj)
  }

  private async scheduleRetry(
    executionId: string,
    hook: CMSHook,
    eventData: Record<string, any>,
    retryAttempt: number,
  ) {
    // For now, we'll just log the retry. In a production system, you'd use a job queue
    console.log(`Scheduling retry ${retryAttempt} for hook ${hook.id}`)

    // Update retry attempt
    await this.supabase
      .from("cms_hook_executions")
      .update({
        status: "retrying",
        retry_attempt: retryAttempt,
      })
      .eq("id", executionId)
  }

  async createHook(hookData: Partial<CMSHook>): Promise<CMSHook | null> {
    try {
      const { data, error } = await this.supabase.from("cms_hooks").insert(hookData).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating hook:", error)
      return null
    }
  }

  async getHooks(): Promise<CMSHook[]> {
    const { data, error } = await this.supabase.from("cms_hooks").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getHookExecutions(hookId: string): Promise<HookExecution[]> {
    const { data, error } = await this.supabase
      .from("cms_hook_executions")
      .select("*")
      .eq("hook_id", hookId)
      .order("executed_at", { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  }
}

// Event types
export const CMS_EVENTS = {
  CONTENT_CREATED: "content.created",
  CONTENT_UPDATED: "content.updated",
  CONTENT_DELETED: "content.deleted",
  CONTENT_PUBLISHED: "content.published",
  CONTENT_UNPUBLISHED: "content.unpublished",
  MEDIA_UPLOADED: "media.uploaded",
  MEDIA_DELETED: "media.deleted",
  USER_ROLE_ASSIGNED: "user.role_assigned",
  USER_ROLE_REMOVED: "user.role_removed",
} as const
