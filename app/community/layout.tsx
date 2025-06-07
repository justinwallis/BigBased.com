import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Community | Big Based",
  description: "Join the Big Based community to discuss features, get help, and connect with other users.",
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Community Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Big Based Community</h1>
              <p className="text-muted-foreground">Connect, discuss, and get help from the community</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search community..." className="pl-10 w-64" />
              </div>
              <Button asChild>
                <Link href="/community/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Topic
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 py-4">
            <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Latest
            </Link>
            <Link
              href="/community/categories"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Categories
            </Link>
            <Link
              href="/community/trending"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Trending
            </Link>
            <Link href="/community/solved" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Solved
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  )
}
