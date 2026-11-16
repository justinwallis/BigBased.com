// Build-level syntax preflight without executing BigBased app code.
// It parses selected TypeScript/TSX and both style sheets, but does not
// make network requests, use credentials, start a server, or contact a database.
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import ts from "typescript"
import postcss from "postcss"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourcePaths = [
  "app/layout.tsx",
  "app/client-layout.tsx",
  "app/about/page.tsx",
  "app/auth/layout.tsx",
  "app/chat/layout.tsx",
  "app/checkout/layout.tsx",
  "app/community/page.tsx",
  "app/community/CommunityClientLayout.tsx",
  "app/contact/page.tsx",
  "app/docs/DocsClientLayout.tsx",
  "app/faq/page.tsx",
  "app/features/page.tsx",
  "app/not-found.tsx",
  "app/partners/page.tsx",
  "app/profile/page.tsx",
  "app/profile/ProfileClientPage.tsx",
  "app/profile/notifications/email/page.tsx",
  "app/profile/notifications/email/EmailNotificationsClientPage.tsx",
  "app/profile/notifications/push/PushNotificationsClientPage.tsx",
  "app/profile/security/change-password/ChangePasswordClientPage.tsx",
  "app/profile/security/two-factor/TwoFactorClientPage.tsx",
  "app/profile/security/sessions/SessionsClientPage.tsx",
  "app/revolution/page.tsx",
  "app/transform/page.tsx",
  "app/visual-review/social/page.tsx",
  "app/visual-review/social/creator/[username]/page.tsx",
  "components/faq-section.tsx",
  "components/chat/chat-input.tsx",
  "components/chat/chat-suggestions.tsx",
  "components/social-preview/SocialFeedPreviewClient.tsx",
  "app/[username]/PublicProfilePageClient.tsx",
]

const errors = []
for (const relativePath of sourcePaths) {
  const full = resolve(root, relativePath)
  const content = readFileSync(full, "utf8")
  const source = ts.createSourceFile(
    full, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX,
  )
  for (const diagnostic of source.parseDiagnostics) {
    const at = source.getLineAndCharacterOfPosition(diagnostic.start ?? 0)
    errors.push(
      relativePath + ":" + (at.line + 1) + ":" + (at.character + 1) +
      ": " + ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
    )
  }
}

for (const relativePath of ["app/globals.css", "styles/bigbased-2025.css"]) {
  try {
    postcss.parse(readFileSync(resolve(root, relativePath), "utf8"), {
      from: relativePath,
    })
  } catch (error) {
    errors.push(relativePath + ": " + String(error))
  }
}
if (errors.length) {
  for (const error of errors) console.error(error)
  console.error(errors.length + " source syntax error(s).")
  process.exitCode = 1
} else {
  console.log("Syntax parse PASS: " + sourcePaths.length +
    " TSX files, 2 CSS files. No application runtime executed.")
}
