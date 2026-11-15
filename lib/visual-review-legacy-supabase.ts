"use client"

/**
 * Visual-review compatibility for BigBased's 2025 Supabase helper imports.
 *
 * @supabase/auth-helpers-nextjs 0.15.0 now forwards to the SSR package and
 * no longer exports createClientComponentClient. The original components
 * use that function in render, but all database/auth methods are called
 * only in browser effects or event handlers.
 *
 * Reuse the app's existing browser client; on the server this returns null.
 * No server-side service-role credential is introduced. This is NOT a
 * production authentication migration, and legacy actions remain subject
 * to the historical app's unreviewed security limitations.
 */

import { supabaseClient } from "./supabase/client"

export function createClientComponentClient() {
  return supabaseClient()
}
