import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

test("Supabase server helper does not log credential prefixes or connection URLs", () => {
  const code = readFileSync(new URL("../../lib/supabase/server.ts", import.meta.url), "utf8")
  assert.doesNotMatch(code, /keyPrefix|urlPreview|supabaseKey\.substring|supabaseUrl\.substring/)
  assert.doesNotMatch(code, /console\.log\(\s*["']Supabase client config/)
  assert.match(code, /Missing Supabase environment variables/)
  assert.match(code, /_createServerClient\(supabaseUrl, supabaseKey/)
  // This is a log-hygiene test, NOT a claim that existing legacy auth/RLS is safe.
})
