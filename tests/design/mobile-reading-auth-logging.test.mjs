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
