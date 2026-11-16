import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const source = (p) => readFileSync(new URL("../../" + p, import.meta.url), "utf8")

test("shared original BB logo uses theme-class asset swap, not hydration timing", () => {
  const logo = source("components/bb-logo.tsx")
  assert.match(logo, /src="\/bb-logo\.png".*dark:hidden/)
  assert.match(logo, /src="\/BigBasedIconInvert\.png".*dark:block/)
  assert.doesNotMatch(logo, /useEffect\(|window\.matchMedia|effectiveTheme/)
})

test("anonymous header loading is legible and truthful", () => {
  const auth = source("components/auth/auth-button.tsx")
  assert.match(auth, /role="status" aria-live="polite"/)
  assert.match(auth, /Checking account…/)
  assert.doesNotMatch(auth, /bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse/)
})

test("fictional feed reuses original cover accents and avoids overlay collision", () => {
  const feed = source("components/social-preview/SocialFeedPreviewClient.tsx")
  assert.match(feed, /bb-2025-cover mt-4/)
  assert.match(feed, /pl-10 shadow-sm/)
  assert.match(feed, /sm:pl-4/)
  const css = source("styles/bigbased-2025.css")
  assert.match(css, /bb-2025-action\[aria-current="page"\]/)
})

test("fictional profile avatar uses original authored 196px centered sizing", () => {
  const page = source("app/visual-review/social/creator/[username]/page.tsx")
  assert.match(page, /bb-2025-avatar flex h-\[196px\] w-\[196px\]/)
  assert.match(page, /pointer-events-none/)
  assert.doesNotMatch(page, /BigBased · Creator community/)
  assert.match(source("styles/bigbased-2025.css"), /border-color: #111827/)
})
