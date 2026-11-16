import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const workflow = readFileSync(new URL("../../.github/workflows/bigbased-local-visual-qa.yml", import.meta.url), "utf8")

test("site-wide visual QA captures six additional routes, not just the social preview", () => {
  for (const route of ["about", "features", "community", "partners", "contact", "auth/sign-in"]) {
    assert.ok(workflow.includes(route), route)
  }
  assert.match(workflow, /route-status\.txt/)
  assert.match(workflow, /HTTP \$code/)
  assert.match(workflow, /screenshots\/\$slug-mobile-dark\.png/)
  assert.match(workflow, /screenshots\/\$slug-desktop-light\.png/)
})

test("screenshots are restricted to localhost with no production credentials", () => {
  assert.match(workflow, /127\.0\.0\.1:3000/)
  assert.match(workflow, /--hostname 127\.0\.0\.1/)
  assert.doesNotMatch(workflow, /https?:\/\/bigbased\.com/)
  assert.doesNotMatch(workflow, /NEXT_PUBLIC_SUPABASE_.*=|OPENAI_API_KEY|STRIPE_SECRET_KEY|VERCEL_TOKEN/)
  assert.match(workflow, /permissions:\s*\n  contents: read/)
  assert.match(workflow, /retention-days: 7/)
})
