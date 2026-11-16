import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const layout = readFileSync(
  new URL("../../app/community/CommunityClientLayout.tsx", import.meta.url), "utf8",
)

test("community desktop sidebar does not consume the mobile viewport", () => {
  assert.match(layout, /hidden h-\[calc\(100dvh-3\.5rem\)\] w-64 shrink-0 overflow-y-auto lg:block/)
  assert.match(layout, /className="min-w-0 flex-1"/)
})

test("community mobile navigation keeps original amber tabs and shares the desktop routes", () => {
  assert.match(layout, /aria-label="Community mobile navigation"/)
  assert.match(layout, /bb-2025-tabs flex max-w-full gap-1 overflow-x-auto/)
  assert.match(layout, /lg:hidden/)
  assert.match(layout, /\[\.\.\.sidebarItems, \.\.\.communityAreaItems\]\.map/)
  assert.match(layout, /aria-current=\{pathname === item\.href \|\| \(isVisualReview && item\.href === "\/community"\)/)
  assert.match(layout, /bb-2025-tab flex shrink-0/)
})

test("community chat is not wired to AI providers or new API endpoints by this styling change", () => {
  assert.doesNotMatch(layout, /\/api\/ai\/chat|OPENAI_API_KEY|fetch\(/)
})

test("credential-free community layout QA uses synthetic server data and is preview-only", () => {
  const page = readFileSync(
    new URL("../../app/visual-review/community/page.tsx", import.meta.url), "utf8",
  )
  const workflow = readFileSync(
    new URL("../../.github/workflows/bigbased-local-visual-qa.yml", import.meta.url), "utf8",
  )
  assert.match(page, /isReviewEnvironment\(\)/)
  assert.match(page, /<CommunityClientLayout>/)
  assert.match(page, /Fictional layout review/)
  assert.doesNotMatch(page, /getCommunityCategories|getRecentTopics|getTrendingTopics|createClient|fetch\(/)
  assert.match(workflow, /visual-review\/community/)
  assert.match(workflow, /grep -qF 'Fictional layout review'/)
  assert.doesNotMatch(workflow, /for route in about features community partners/)
})

test("fictional community visual QA does not surface the legacy invented chat or tag counts", () => {
  assert.match(layout, /const isVisualReview = pathname === "\/visual-review\/community"/)
  for (const section of ["Chat Section", "Tags", "Channels"]) {
    assert.ok(layout.includes(section), section)
  }
  assert.ok((layout.match(/className=\{isVisualReview \? "hidden" : undefined\}/g) ?? []).length >= 3)
})
