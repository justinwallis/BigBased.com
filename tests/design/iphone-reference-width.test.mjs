import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL("../../" + path, import.meta.url), "utf8")

test("narrow iPhone reference has three screenshot captures at 375x812", () => {
  const workflow = read(".github/workflows/bigbased-local-visual-qa.yml")
  for (const image of [
    "sign-in-iphone-375-dark.png",
    "faq-iphone-375-dark.png",
    "creator-iphone-375-dark.png",
  ]) {
    assert.ok(workflow.includes(image), image)
  }
  assert.ok((workflow.match(/--viewport-size="375,812"/g) ?? []).length >= 3)
  assert.match(workflow, /127\.0\.0\.1:3000/)
})

test("Chromium layout checks cover narrow iPhone width without auth or remote API", () => {
  const script = read("scripts/check-local-visual-browser.cjs")
  assert.match(script, /checkPage\(browser, path, marker, 375, 812, "dark"\)/)
  assert.match(script, /scenarios\[3\], scenarios\[5\], scenarios\[7\]/)
  assert.match(script, /document\.documentElement\.scrollWidth/)
  assert.match(script, /getComputedStyle\(root\)\.backgroundColor/)
  assert.doesNotMatch(script, /https?:\/\/(?!127\.0\.0\.1)|OPENAI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/)
})

test("original auth page has intentional centered brand but inherits one root theme provider", () => {
  const original = read("app/[username]/PublicProfilePageClient.tsx")
  const root = read("app/layout.tsx")
  const auth = read("app/auth/layout.tsx")
  assert.match(original, /from-blue-600 via-purple-600 to-indigo-600/)
  assert.match(root, /<ThemeProvider/)
  assert.doesNotMatch(auth, /<ThemeProvider/)
  assert.match(auth, /data-bb-auth-brand/)
  assert.match(auth, /BIG BASED/)
  assert.match(auth, /bb-2025-panel/)
})
