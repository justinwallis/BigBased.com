import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const source = (path) => readFileSync(
  new URL("../../" + path, import.meta.url), "utf8",
)

test("FAQ filters clear the previously selected accordion panel", () => {
  const faq = source("components/faq-section.tsx")
  assert.match(faq, /setActiveCategory\(category\)/)
  assert.match(faq, /setActiveIndex\(null\)/)
  assert.match(faq, /aria-controls=\{\x60\$\{answerIdPrefix\}/)
  assert.match(faq, /aria-expanded=\{activeIndex === index\}/)
  assert.match(faq, /hidden=\{activeIndex !== index\}/)
  assert.match(faq, /aria-pressed=\{activeCategory === category\}/)
})

test("FAQ, Docs and auth inherit existing profile master visual controls", () => {
  const faq = source("components/faq-section.tsx")
  const docs = source("app/docs/DocsClientLayout.tsx")
  const auth = source("app/auth/layout.tsx")
  assert.match(faq, /bb-2025-panel/)
  assert.match(faq, /bb-2025-tab/)
  assert.match(docs, /bb-2025-field/)
  assert.match(docs, /bb-2025-panel/)
  assert.doesNotMatch(docs, /focus:border-blue-500/)
  assert.match(auth, /bb-2025-panel/)
})

test("original amber active tabs respond to pressed state and keyboard focus", () => {
  const css = source("styles/bigbased-2025.css")
  assert.match(css, /bb-2025-tab\[aria-pressed="true"\]/)
  assert.match(css, /bb-2025-action:focus-visible/)
  assert.match(css, /bb-2025-tab:focus-visible/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.match(css, /var\(--bb-2025-selected\)/)
})

test("syntax QA is parser-only and must not activate app runtimes or secrets", () => {
  const script = source("scripts/check-design-syntax.mjs")
  const workflow = source(".github/workflows/bigbased-design-syntax.yml")
  assert.match(script, /createSourceFile/)
  assert.match(script, /postcss\.parse/)
  assert.doesNotMatch(script, /child_process|fetch\(|process\.env\.SUPABASE|next build/)
  assert.match(workflow, /--frozen-lockfile --ignore-scripts/)
  assert.match(workflow, /node scripts\/check-design-syntax.mjs/)
  assert.match(workflow, /contents: read/)
})
