import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AuthLayout from "@/app/auth/layout"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "BigBased sign-in shell — fictional design review",
  description: "Visual-only sign-in review with disabled controls. No authentication.",
  robots: { index: false, follow: false },
}

// Reuse the *actual* authored authentication shell so visual QA measures
// its brand, spacing and dark-mode surfaces. All fields are disabled; this
// route intentionally imports no auth client, action, provider or session.
export default function SignInShellVisualReviewPage() {
  if (!isReviewEnvironment()) notFound()

  return (
    <AuthLayout>
      <section aria-label="Fictional sign-in layout review" className="space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="bb-2025-dim mt-2 text-sm">
            Sign-in layout review · no real account connection.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="review-login-email" className="block text-sm font-medium">Email</label>
            <input id="review-login-email" type="email" placeholder="Enter your email"
              disabled autoComplete="off"
              className="bb-2025-field min-h-[35px] w-full px-3 text-sm disabled:opacity-60" />
          </div>
          <div className="space-y-2">
            <label htmlFor="review-login-password" className="block text-sm font-medium">Password</label>
            <input id="review-login-password" type="password" placeholder="Enter your password"
              disabled autoComplete="off"
              className="bb-2025-field min-h-[35px] w-full px-3 text-sm disabled:opacity-60" />
          </div>
          <button type="button" disabled
            className="bb-2025-action w-full text-sm disabled:cursor-not-allowed">
            Sign In · disabled in preview
          </button>
        </div>
        <p className="bb-2025-dim text-center text-xs">
          Fictional layout only. This page cannot authenticate, register users or verify MFA.
        </p>
      </section>
    </AuthLayout>
  )
}
