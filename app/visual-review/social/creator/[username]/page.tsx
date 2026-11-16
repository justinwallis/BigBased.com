import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen, Compass, Heart, ImageIcon, LockKeyhole, MessageCircle, ShieldCheck, UserPlus } from "lucide-react"
import { getFictionalReviewCreator } from "@/lib/social-v1/preview.mjs"
import { isReviewEnvironment } from "@/lib/social-v1/core.mjs"

export const metadata: Metadata = {
  title: "Creator profile — fictional BigBased design review",
  description: "Fictional public creator presentation for layout review only.",
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ username: string }> }

// Completely isolated profile study: no account, messages, follows or social
// database. Only a server-side minimum public projection reaches the template.
export default async function SocialCreatorVisualReviewPage({ params }: Props) {
  if (!isReviewEnvironment()) notFound()
  const { username } = await params
  const creator = getFictionalReviewCreator(username)
  if (!creator) notFound()

  const initials = creator.display_name.split(/\s+/).slice(0, 2).map((part: string) => part.slice(0, 1).toUpperCase()).join("")

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[#f7f6fa] pb-16 text-[#24202c] dark:bg-[#070709] dark:text-white">
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#101012]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link href="/visual-review/social" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-violet-50 dark:hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to social preview
          </Link>
          <span className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
            Fictional profile · No live account
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-3 pt-5 sm:px-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#141316]">
          <div className="relative h-44 bg-gradient-to-r from-[#2545e8] via-[#6936d6] to-[#833dd4] sm:h-60">
            <div className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              BigBased · Creator community
            </div>
            <div aria-hidden="true" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <ImageIcon className="h-5 w-5 text-white/80" />
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-white bg-[#f6f3fa] text-3xl font-extrabold text-[#583285] shadow-md dark:border-[#141316] sm:-mt-16 sm:h-36 sm:w-36">
              {initials}
            </div>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{creator.display_name}</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">@{creator.username} · Fictional creator</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed">{creator.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button disabled type="button" title="Account follows are not connected" className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white opacity-60">
                  <UserPlus className="h-4 w-4" /> Follow · unavailable
                </button>
                <button disabled type="button" title="Member messaging is not connected" className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold opacity-60 dark:border-white/20">
                  <MessageCircle className="h-4 w-4" /> Message · unavailable
                </button>
              </div>
            </div>
            <nav aria-label="Creator review sections" className="mt-6 flex items-center gap-7 border-t border-slate-100 pt-4 text-sm font-semibold dark:border-white/10">
              <span className="border-b-2 border-violet-700 pb-2 text-violet-700 dark:text-violet-300">Posts</span>
              <span className="pb-2 text-slate-500">About</span>
              <span className="pb-2 text-slate-500">Projects · future</span>
            </nav>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#141316]">
              <h2 className="text-base font-bold">Intro</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">The original BigBased profile identity is preserved here: rich cover artwork, a prominent creator avatar, and community-focused sections.</p>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-violet-50 p-3 text-xs text-violet-800 dark:bg-violet-500/10 dark:text-violet-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Only public presentation fields are used. No email, personal contact information, or private account details.</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#141316]">
              <h2 className="text-base font-bold">Creator tools · planned</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><BookOpen className="h-4 w-4" /> Creator portfolio</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Compass className="h-4 w-4" /> Communities and discovery</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><LockKeyhole className="h-4 w-4" /> Audience and publishing controls</p>
            </div>
          </aside>

          <section aria-label="Fictional creator posts" className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-[#141316]">
              <h2 className="text-lg font-bold">Example posts</h2>
              <p className="mt-1 text-xs text-slate-500">Sample content only. No follower numbers, engagement metrics, or actual user activity.</p>
            </div>
            {creator.posts.map((post: { id: string; text: string; topic: string; community: string }) => (
              <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#141316]">
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">{post.community} · Fictional sample</p>
                <p className="mt-3 text-sm leading-relaxed">{post.text}</p>
                <div className="mt-4 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-[#e7dcf6] to-[#cbc2ec] px-4 text-center text-base font-semibold text-[#493466] dark:from-[#342043] dark:to-[#1e182d] dark:text-violet-200">
                  {post.topic}
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-white/10">
                  <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" /> Reactions · demo only</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> Replies · demo only</span>
                </div>
              </article>
            ))}
            {creator.posts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-white/20 dark:bg-[#141316]">
                No fictional sample posts for this creator.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
