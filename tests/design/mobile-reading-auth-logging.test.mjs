import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL("../../" + path, import.meta.url), "utf8")

test("marketing information pages reserve the left-edge mobile menu gutter without changing original public profile", () => {
  for (const page of ["about", "features", "partners", "contact", "transform"]) {
    assert.match(read("app/" + page + "/page.tsx"), /bb-2025-page bb-2025-reading-page/, page)
  }
  const css = read("styles/bigbased-2025.css")
  assert.match(css, /@media \(max-width: 639px\)/)
  assert.match(css, /\.bb-2025-page\.bb-2025-reading-page/)
  assert.match(css, /padding-left: max\(3\.5rem, env\(safe-area-inset-left\)\)/)
  assert.doesNotMatch(read("app/[username]/PublicProfilePageClient.tsx"), /bb-2025-reading-page/)
  assert.doesNotMatch(read("app/visual-review/social/creator/[username]/page.tsx"), /bb-2025-reading-page/)
})

test("sign-in UI no longer logs credentials, email addresses, MFA values or sign-in results", () => {
  const page = read("app/auth/sign-in/page.tsx")
  const form = read("components/auth/sign-in-form.tsx")
  for (const [name, code] of [["sign-in page", page], ["sign-in form", form]]) {
    assert.doesNotMatch(code, /console\.(log|error|debug|warn)\s*\(/, name)
  }
  assert.match(page, /sessionStorage\.removeItem\("loginPassword"\)/)
  assert.match(page, /<SignInForm/)
  assert.match(form, /await signIn\(email, password, mfaCode \|\| undefined\)/)
  assert.match(form, /sessionStorage\.removeItem\("mfaEmail"\)/)
  assert.match(form, /sessionStorage\.removeItem\("mfaRequired"\)/)
})

test("security-only logging cleanup leaves existing sign-in submission and error UI available", () => {
  const page = read("app/auth/sign-in/page.tsx")
  const form = read("components/auth/sign-in-form.tsx")
  assert.match(page, /if \(isLoading\)/)
  assert.match(page, /if \(isLoggedIn\)/)
  assert.match(page, /errorMessage &&/)
  assert.match(form, /<form onSubmit=\{handleSubmit\}/)
  assert.match(form, /error &&/)
  assert.match(form, /router\.push\("\/profile"\)/)
})

test("sign-in visual review reuses real auth shell but cannot submit credentials", () => {
  const p = read("app/visual-review/sign-in/page.tsx")
  assert.match(p, /isReviewEnvironment\(\)/)
  assert.match(p, /<AuthLayout>/)
  assert.match(p, /robots: \{ index: false, follow: false \}/)
  assert.match(p, /Fictional sign-in layout review/)
  assert.match(p, /type="email"[^>]*\sdisabled/)
  assert.match(p, /type="password"[^>]*\sdisabled/)
  assert.match(p, /<button type="button" disabled/)
  assert.doesNotMatch(p, /<form|fetch\(|supabaseClient|useAuth|signIn\(/)
  const w = read(".github/workflows/bigbased-local-visual-qa.yml")
  assert.match(w, /visual-review\/sign-in/)
  assert.match(w, /Sign-in layout review/)
  assert.doesNotMatch(w, /for route in about features visual-review\/community partners contact auth\/sign-in/)
})

test("auth screens inherit the single canonical BigBased header and theme provider", () => {
  const root = read("app/layout.tsx")
  const shell = read("app/auth/layout.tsx")
  const preview = read("app/visual-review/sign-in/page.tsx")
  assert.match(root, /<ThemeProvider/)
  assert.match(root, /<ClientLayout>/)
  assert.match(shell, /bb-2025-page/)
  assert.match(shell, /bb-2025-panel/)
  assert.match(shell, /<ThemeToggle/)
  assert.doesNotMatch(shell, /<ThemeProvider|<Image|<BBLogo|BIG BASED/)
  assert.match(preview, /<AuthLayout>/)
})

test("FAQ has one visible title while preserving content and structured-data output", () => {
  const page = read("app/faq/page.tsx")
  const section = read("components/faq-section.tsx")
  assert.match(page, /<h1[^>]*>Frequently Asked Questions<\/h1>/)
  assert.match(page, /title=\{null\}/)
  assert.match(page, /description=\{null\}/)
  assert.match(page, /getFAQPageData/)
  assert.match(page, /<StructuredData data=\{structuredData\}/)
  assert.match(section, /const showIntro = Boolean\(title \|\| description\)/)
  assert.match(section, /\{showIntro && \(/)
  assert.match(section, /className=\{\`bb-2025-tab text-sm capitalize transition-colors/)
  assert.doesNotMatch(section, /rounded-full text-sm font-medium capitalize transition-colors/)
})

test("browser QA verifies on-screen branding, overflow, and disabled auth locally", () => {
  const code = read("scripts/check-local-visual-browser.cjs")
  const workflow = read(".github/workflows/bigbased-local-visual-qa.yml")
  assert.match(code, /http:\/\/127\.0\.0\.1:3000/)
  assert.match(code, /document\.documentElement\.scrollWidth/)
  assert.match(code, /document\.body\.scrollWidth/)
  assert.match(code, /one on-screen BB logo/)
  assert.match(code, /input\[type="email"\]:disabled/)
  assert.match(code, /input\[type="password"\]:disabled/)
  assert.match(code, /path === "\/faq"/)
  assert.match(code, /getComputedStyle\(root\)\.backgroundColor/)
  assert.match(code, /getComputedStyle\(panel\)\.backgroundColor/)
  assert.match(code, /original 2025 amber selected-tab color/)
  assert.doesNotMatch(code, /https?:\/\/(?!127\.0\.0\.1)|OPENAI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(workflow, /NODE_PATH=\/tmp\/bb-playwright\/node_modules node scripts\/check-local-visual-browser.cjs/)
  assert.match(workflow, /--ignore-scripts/)
})
