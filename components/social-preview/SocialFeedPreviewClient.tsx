"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import {
  Bell, Bookmark, Check, Compass, FileText, Heart, Home, ImageIcon,
  MessageCircle, PenLine, Search, Send, Share2, ShieldCheck, Users, X, Moon, Sun,
} from "lucide-react"

type Tab = "Home" | "Communities" | "Explore" | "Saved" | "Profile"
type DemoPost = {
  id: string
  author: string
  handle: string
  initials: string
  community: string
  time: string
  text: string
  topic: string
  avatarClass: string
}

const samplePosts: DemoPost[] = [
  {
    id: "fictional-post-1",
    author: "Sample Creator",
    handle: "@samplecreator",
    initials: "SC",
    community: "Creator Commons",
    time: "Sample post",
    text: "What if your work, audience, and publishing tools actually belonged to you? Here is a place to share an idea, start a discussion, and build something together.",
    topic: "Creator independence",
    avatarClass: "bg-violet-500",
  },
  {
    id: "fictional-post-2",
    author: "BigBased Demo Team",
    handle: "@demo",
    initials: "BB",
    community: "Community Showcase",
    time: "Sample post",
    text: "Welcome to a social space made for creators. Explore community posts, bookmark ideas, and prepare your next project. Everything on this screen is fictional review data.",
    topic: "Community showcase",
    avatarClass: "bg-slate-800",
  },
  {
    id: "fictional-post-3",
    author: "Fictional Studio",
    handle: "@fictionalstudio",
    initials: "FS",
    community: "Independent Publishing",
    time: "Sample post",
    text: "A better publishing workflow begins with control: write a draft, choose your audience, revise your work, and decide where to publish.",
    topic: "Publishing",
    avatarClass: "bg-amber-700",
  },
]

const tabs: { label: Tab; icon: typeof Home }[] = [
  { label: "Home", icon: Home },
  { label: "Communities", icon: Users },
  { label: "Explore", icon: Compass },
  { label: "Saved", icon: Bookmark },
  { label: "Profile", icon: FileText },
]

const mobileTabs: Array<{ label: string; icon: typeof Home; tab?: Tab; compose?: true }> = [
  { label: "Home", icon: Home, tab: "Home" },
  { label: "Communities", icon: Users, tab: "Communities" },
  { label: "Create", icon: PenLine, compose: true },
  { label: "Explore", icon: Compass, tab: "Explore" },
  { label: "Profile", icon: FileText, tab: "Profile" },
]

const communities = [
  "Creator Commons",
  "Independent Publishing",
  "Community Showcase",
]

export function SocialFeedPreviewClient() {
  const { resolvedTheme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>("Home")
  const [query, setQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [draftText, setDraftText] = useState("")
  const [drafts, setDrafts] = useState<string[]>([])
  const [liked, setLiked] = useState<Set<string>>(() => new Set())
  const [saved, setSaved] = useState<Set<string>>(() => new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [localReplies, setLocalReplies] = useState<Record<string, string[]>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)

  const visiblePosts = useMemo(() => {
    return samplePosts.filter((post) => {
      if (activeTab === "Saved" && !saved.has(post.id)) return false
      if (activeTab === "Communities" && selectedCommunity && post.community !== selectedCommunity) return false
      if (activeTab === "Profile") return false
      const search = query.trim().toLowerCase()
      if (!search) return true
      return [post.author, post.community, post.text, post.topic]
        .some((value) => value.toLowerCase().includes(search))
    })
  }, [activeTab, selectedCommunity, query, saved])

  function selectTab(tab: Tab) {
    setActiveTab(tab)
    setNotice(null)
    if (tab !== "Communities") setSelectedCommunity(null)
  }

  function toggleItem(id: string, current: Set<string>, setter: (next: Set<string>) => void) {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setter(next)
  }

  function saveDraft() {
    const value = draftText.trim()
    if (!value) return
    setDrafts((existing) => [value.slice(0, 1500), ...existing])
    setDraftText("")
    setComposerOpen(false)
    setNotice("Private example draft saved in this browser session. Nothing was published.")
    setActiveTab("Profile")
  }

  function addLocalReply(postId: string) {
    const value = replyText.trim()
    if (!value) return
    setLocalReplies((current) => ({
      ...current,
      [postId]: [...(current[postId] ?? []), value.slice(0, 600)],
    }))
    setReplyText("")
    setNotice("Example-only reply added locally. No real user was notified.")
  }

  const emptyCopy = activeTab === "Saved"
    ? "Save an example post to see it here."
    : activeTab === "Communities"
      ? "Choose another example community or clear the selection."
      : "No fictional posts match that search."

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[#f7f6fa] pb-20 text-[#24202c] dark:bg-[#080808] dark:text-[#f7f5fa] lg:pb-4">
      <div className="border-b border-violet-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#101014]/95">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/bb-logo.png" alt="BigBased" width={38} height={38} className="h-9 w-9 rounded-xl object-contain dark:bg-white" />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight sm:text-base">BigBased <span className="text-violet-600">Social</span></p>
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">Creator-first community · design study</p>
            </div>
          </div>
          <label className="hidden w-full max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-[#f5f4f8] px-4 py-2 focus-within:border-violet-400 dark:border-white/10 dark:bg-white/5 md:flex">
            <Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <span className="sr-only">Search fictional posts</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search creators, posts, communities"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowSearch((value) => !value)} className="rounded-full p-2 hover:bg-violet-50 dark:hover:bg-white/10 md:hidden" aria-label="Toggle sample search">
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 hover:bg-violet-50 dark:hover:bg-white/10"
              aria-label={resolvedTheme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setNotice("Notifications will appear here after the social backend and permissions are approved.")}
              className="rounded-full p-2 hover:bg-violet-50 dark:hover:bg-white/10"
              aria-label="Review notification status"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-800 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200">
              Fictional preview
            </span>
          </div>
        </div>
        {showSearch && (
          <div className="mx-auto mt-3 max-w-[1440px] md:hidden">
            <input type="search" aria-label="Search fictional posts" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sample content" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 dark:border-white/20 dark:bg-white/5" />
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-3 pt-5 sm:px-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_260px]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#141316]">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Your space</p>
              <nav aria-label="Social preview navigation" className="space-y-1">
                {tabs.map(({ label, icon: Icon }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => selectTab(label)}
                    className={"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition " +
                      (activeTab === label ? "bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-200" : "hover:bg-slate-50 dark:hover:bg-white/5")}
                    aria-current={activeTab === label ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm shadow-sm dark:border-white/10 dark:bg-[#141316]">
              <p className="mb-2 font-semibold">Creator independence</p>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">A place for communities, creator-owned work and publishing. No account or external service is connected in this review.</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-4" aria-label="BigBased social preview">
          <div className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm dark:border-violet-400/20 dark:bg-[#141316]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">BigBased community</p>
                <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{activeTab === "Home" ? "Your feed" : activeTab}</h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A familiar social experience built for creators—not a copy of Facebook.</p>
              </div>
              <span className="hidden rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-200 sm:block">Design v1</span>
            </div>
          </div>

          {notice && (
            <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-100">
              <p>{notice}</p>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
            </div>
          )}

          {activeTab === "Communities" && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setSelectedCommunity(null)}
                className={"rounded-full px-3 py-2 text-xs font-semibold " + (!selectedCommunity ? "bg-violet-700 text-white" : "bg-white dark:bg-white/10")}>All communities</button>
              {communities.map((name) => (
                <button type="button" key={name} onClick={() => setSelectedCommunity(name)}
                  className={"rounded-full px-3 py-2 text-xs font-semibold " +
                    (selectedCommunity === name ? "bg-violet-700 text-white" : "bg-white dark:bg-white/10")}>
                  {name}
                </button>
              ))}
            </div>
          )}

          {activeTab === "Profile" ? (
            <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-[#141316]">
              <div className="h-28 bg-gradient-to-r from-[#3d275e] via-[#7553a1] to-[#ab89ce] sm:h-36" />
              <div className="px-5 pb-6">
                <div className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-violet-700 text-base font-bold text-white dark:border-[#141316]">SC</div>
                <h2 className="mt-2 text-lg font-bold">Sample Creator</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">@samplecreator · fictional profile</p>
                <p className="mt-3 text-sm">Your creator portfolio, public posts, private drafts and approved publishing destinations would live here.</p>
                <h3 className="mb-2 mt-6 text-sm font-bold">Private local drafts ({drafts.length})</h3>
                {drafts.length === 0 ? <p className="text-sm text-slate-500">No local drafts. Try the Create button below.</p> : (
                  <div className="space-y-2">
                    {drafts.map((draft, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10">
                        <span className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">Private · Browser only</span>
                        <p className="whitespace-pre-wrap break-words">{draft}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#141316]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-700 font-bold text-white">SC</span>
                  <button type="button" onClick={() => setComposerOpen(true)}
                    className="flex-1 rounded-full bg-[#f4f3f7] px-4 py-3 text-left text-sm text-slate-500 transition hover:bg-violet-50 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10">
                    What are you building or sharing?
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-around border-t border-slate-100 pt-3 dark:border-white/10">
                  <button type="button" onClick={() => setComposerOpen(true)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5">
                    <ImageIcon className="h-4 w-4 text-violet-600" /> Media
                  </button>
                  <button type="button" onClick={() => setComposerOpen(true)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5">
                    <PenLine className="h-4 w-4 text-violet-600" /> Write
                  </button>
                  <button type="button" onClick={() => setNotice("Community publishing remains disabled until creator permissions are tested.")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5">
                    <Users className="h-4 w-4 text-violet-600" /> Community
                  </button>
                </div>
              </div>

              {visiblePosts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-white/20 dark:bg-[#141316]">
                  {emptyCopy}
                </div>
              )}

              {visiblePosts.map((post) => (
                <article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-[#141316]">
                  <div className="flex items-start gap-3 px-4 pt-4">
                    <span className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white " + post.avatarClass}>{post.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{post.author} <span className="font-normal text-slate-500">{post.handle}</span></p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{post.community} · {post.time} · Public example</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-white/10">Demo</span>
                  </div>
                  <div className="px-4 pb-4 pt-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">{post.text}</p>
                    <div className="mt-4 flex min-h-[116px] items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 via-[#f0e7fa] to-[#e4dcf0] px-5 text-center dark:from-[#2e203c] dark:via-[#39284a] dark:to-[#18121e]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">BigBased · Creator community</p>
                        <p className="mt-2 text-xl font-bold tracking-tight text-[#372346] dark:text-[#eee1ff]">{post.topic}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 border-t border-slate-100 px-3 py-2 dark:border-white/10">
                    <button type="button" onClick={() => toggleItem(post.id, liked, setLiked)} aria-pressed={liked.has(post.id)}
                      className={"flex items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 " +
                        (liked.has(post.id) ? "text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-slate-300")}>
                      <Heart className={"h-4 w-4 " + (liked.has(post.id) ? "fill-current" : "")} /> Like
                    </button>
                    <button type="button" onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyText("") }}
                      aria-expanded={replyingTo === post.id}
                      className="flex items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5">
                      <MessageCircle className="h-4 w-4" /> Reply
                    </button>
                    <button type="button" onClick={() => { toggleItem(post.id, saved, setSaved); setNotice("This bookmark is saved only in the local demonstration.") }}
                      aria-pressed={saved.has(post.id)}
                      className={"flex items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 " +
                        (saved.has(post.id) ? "text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-slate-300")}>
                      <Bookmark className={"h-4 w-4 " + (saved.has(post.id) ? "fill-current" : "")} /> Save
                    </button>
                    <button type="button" onClick={() => setNotice("Sharing requires a real post, publication permission and a reviewed destination. Disabled in this fictional preview.")}
                      className="flex items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                  {(replyingTo === post.id || (localReplies[post.id]?.length ?? 0) > 0) && (
                    <div className="space-y-3 border-t border-slate-100 px-4 py-4 dark:border-white/10">
                      {(localReplies[post.id] ?? []).map((reply, index) => (
                        <div key={index} className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-white/5">
                          <span className="text-xs font-semibold text-violet-600 dark:text-violet-300">You · Local-only reply</span>
                          <p className="mt-1 break-words">{reply}</p>
                        </div>
                      ))}
                      {replyingTo === post.id && (
                        <form onSubmit={(event) => { event.preventDefault(); addLocalReply(post.id) }} className="flex gap-2">
                          <input value={replyText} onChange={(event) => setReplyText(event.target.value)} maxLength={600}
                            aria-label={"Reply to " + post.author} placeholder="Write a fictional reply..."
                            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-violet-400 dark:border-white/20 dark:bg-white/5" />
                          <button type="submit" disabled={!replyText.trim()} aria-label="Add local reply"
                            className="rounded-full bg-violet-700 p-2.5 text-white disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
                        </form>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </>
          )}
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#141316]">
              <h2 className="mb-3 text-sm font-bold">Discover communities</h2>
              <div className="space-y-2">
                {communities.map((name, index) => (
                  <button type="button" key={name}
                    onClick={() => { setActiveTab("Communities"); setSelectedCommunity(name) }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-white/5">
                    <span className={"h-8 w-8 rounded-xl " + (index === 0 ? "bg-violet-200" : index === 1 ? "bg-amber-100" : "bg-slate-200")} />
                    <span className="font-semibold">{name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#141316]">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-600" /><h2 className="text-sm font-bold">Made for creators</h2></div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Audience control, independent publishing, community tools and transparent moderation are planned. This screen does not represent active accounts or engagement.</p>
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="Mobile social preview navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur dark:border-white/10 dark:bg-[#141316]/95 lg:hidden">
        {mobileTabs.map(({ label, icon: Icon, tab, compose }) => (
          <button
            type="button"
            key={label}
            onClick={() => compose ? setComposerOpen(true) : tab && selectTab(tab)}
            aria-current={!compose && activeTab === tab ? "page" : undefined}
            aria-label={compose ? "Create a private example draft" : label}
            className={"flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold " +
              (compose ? "text-violet-700 dark:text-violet-300" :
                activeTab === tab ? "text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-slate-400")}
          >
            <Icon className={compose ? "h-6 w-6" : "h-5 w-5"} />
            {label}
          </button>
        ))}
      </nav>

      <button type="button" onClick={() => setComposerOpen(true)} aria-label="Create a private local draft"
        className="fixed bottom-6 right-4 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-violet-700 text-white shadow-xl transition hover:bg-violet-800 lg:flex">
        <PenLine className="h-5 w-5" />
      </button>

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg rounded-2xl border-violet-200 bg-white p-5 text-[#24202c] shadow-2xl dark:border-violet-400/20 dark:bg-[#1d1824] dark:text-white">
          <DialogTitle className="pr-8 text-lg font-bold">Create a private draft</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Saved in memory in this browser tab only. No real account, upload, database or publishing action.
          </DialogDescription>
          <textarea
            rows={6}
            value={draftText}
            maxLength={1500}
            onChange={(event) => setDraftText(event.target.value)}
            placeholder="What would you like to share with your future community?"
            aria-label="Write private example draft"
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-[#f7f6fa] p-4 text-sm outline-none focus:border-violet-500 dark:border-white/20 dark:bg-white/5"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" /> Private · demo only</span>
            <button type="button" onClick={saveDraft} disabled={!draftText.trim()}
              className="flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
              <Check className="h-4 w-4" /> Save local draft
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
