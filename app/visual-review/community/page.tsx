import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CommunityClientLayout } from "@/app/community/CommunityClientLayout"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "BigBased Community — fictional layout review",
  description: "Credential-free layout review using synthetic categories only.",
  robots: { index: false, follow: false },
}

const fictionalCategories = [
  { title: "Creator Commons", summary: "Fictional space for independent creators to discuss their work." },
  { title: "Independent Publishing", summary: "Fictional example of a community about publishing tools and ownership." },
  { title: "Community Showcase", summary: "Fictional area for sharing projects and demonstrations." },
]

// Real /community requires existing database actions. Render the actual
// community layout with synthetic-only children so mobile/desktop visual QA
// can run without connecting accounts, Supabase or chat providers.
export default function CommunityVisualReviewPage() {
  if (!isReviewEnvironment()) notFound()
  return (
    <CommunityClientLayout>
      <main className="bb-2025-page min-w-0 px-3 py-6 sm:px-6">
        <div className="bb-2025-container">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Welcome to BigBased Community</h1>
            <p className="bb-2025-dim mt-2 text-sm">
              Fictional layout review. No live posts, memberships, or chat sessions.
            </p>
          </header>
          <section aria-label="Fictional community categories" className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {fictionalCategories.map((category) => (
              <article key={category.title} className="bb-2025-panel min-w-0 p-5">
                <h2 className="text-base font-semibold">{category.title}</h2>
                <p className="bb-2025-dim mt-2 text-sm leading-relaxed">{category.summary}</p>
                <p className="bb-2025-dim mt-4 text-xs">Preview only · No real activity</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </CommunityClientLayout>
  )
}
