import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"

function read(path) {
  return readFileSync(new URL("../../" + path, import.meta.url))
}

function text(path) {
  return read(path).toString("utf8")
}

test("original 2025 BigBased profile master source is not modified", () => {
  const bytes = read("app/[username]/PublicProfilePageClient.tsx")
  const header = Buffer.from("blob " + bytes.length + "\0")
  const blobHash = createHash("sha1").update(header).update(bytes).digest("hex")
  assert.equal(blobHash, "04ef8e7d6a8a9f1d14afdadd869e62750bf948a8")
})

test("derived style values match original authored profile and original header stays shared", () => {
  const master = text("app/[username]/PublicProfilePageClient.tsx")
  const css = text("styles/bigbased-2025.css")
  assert.match(master, /from-blue-600 via-purple-600 to-indigo-600/)
  assert.match(master, /border-amber-500/)
  assert.match(master, /max-w-\[1220px\]/)
  assert.match(master, /h-\[35px\]/)
  for (const token of ["#080808", "#0d0d0d", "#131313", "#2563eb", "#9333ea", "#4f46e5", "#f59e0b", "#fbbf24", "1220px", "35px"]) {
    assert.ok(css.includes(token), token)
  }
  assert.match(css, /\.bb-2025-page/)
  assert.match(css, /\.bb-2025-tab/)
  assert.match(text("app/layout.tsx"), /styles\/bigbased-2025.css/)
  assert.doesNotMatch(text("app/client-layout.tsx"), /bb-2025-page/)
})

test("key public-facing pages use the reusable visual system without copying the profile JSX", () => {
  const routes = [
    "app/community/page.tsx",
    "app/about/page.tsx",
    "app/features/page.tsx",
    "app/partners/page.tsx",
    "app/contact/page.tsx",
    "app/revolution/page.tsx",
    "app/profile/page.tsx",
    "app/chat/layout.tsx",
    "app/community/CommunityClientLayout.tsx",
    "app/faq/page.tsx",
    "app/transform/page.tsx",
    "app/auth/layout.tsx",
    "app/docs/DocsClientLayout.tsx",
    "app/profile/ProfileClientPage.tsx",
    "app/profile/notifications/email/page.tsx",
    "app/profile/notifications/email/EmailNotificationsClientPage.tsx",
    "app/profile/notifications/push/PushNotificationsClientPage.tsx",
    "app/profile/security/change-password/ChangePasswordClientPage.tsx",
    "app/profile/security/two-factor/TwoFactorClientPage.tsx",
    "app/profile/security/sessions/SessionsClientPage.tsx",
    "app/checkout/layout.tsx",
    "app/not-found.tsx",
    "components/social-preview/SocialFeedPreviewClient.tsx",
    "app/visual-review/social/creator/[username]/page.tsx",
  ]
  for (const path of routes) {
    assert.match(text(path), /bb-2025-page/, path)
  }
  assert.match(text("app/community/page.tsx"), /bb-2025-panel/)
  assert.match(text("components/chat/chat-input.tsx"), /bb-2025-field/)
  assert.match(text("components/chat/chat-suggestions.tsx"), /bb-2025-action/)
  assert.match(text("app/visual-review/social/creator/[username]/page.tsx"), /bb-2025-cover/)
  assert.match(text("app/visual-review/social/creator/[username]/page.tsx"), /bb-2025-avatar/)
})

test("social preview relies on global original BB logo/navigation, not a second site header", () => {
  const feed = text("components/social-preview/SocialFeedPreviewClient.tsx")
  const profile = text("app/visual-review/social/creator/[username]/page.tsx")
  assert.doesNotMatch(feed, /src="\/bb-logo\.png"/)
  assert.match(feed, /bb-2025-page/)
  assert.match(feed, /bb-2025-tab/)
  assert.doesNotMatch(profile, /BigBased Social<\/span>/)
  assert.match(profile, /pointer-events-none/)
  assert.match(profile, /aria-current="page"/)
})
