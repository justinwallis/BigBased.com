import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { getDocumentationCategories } from "@/app/actions/documentation-actions"
import { Search, BookOpen, FileText, Bookmark, Star, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Documentation | Big Based",
  description: "Learn how to use the Big Based platform with our comprehensive documentation.",
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getDocumentationCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Big Based</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/docs" className="transition-colors hover:text-foreground/80">
              Documentation
            </Link>
            <Link href="/community" className="transition-colors hover:text-foreground/80">
              Community
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground/80">
              Blog
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="w-64 rounded-full bg-background pl-8 md:w-80"
                />
              </div>
            </form>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <div className="flex flex-col space-y-1">
              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <BookOpen className="h-4 w-4" />
                Documentation Home
              </Link>
              <div className="mt-4">
                <h4 className="mb-1 px-3 text-sm font-semibold">Categories</h4>
                <div className="flex flex-col space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/docs/${category.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="flex items-center gap-2">
                        {category.icon && (
                          <span className="text-muted-foreground">
                            {/* Dynamically render icon based on name */}
                            {category.icon === "book-open" && <BookOpen className="h-4 w-4" />}
                            {category.icon === "file-text" && <FileText className="h-4 w-4" />}
                            {category.icon === "bookmark" && <Bookmark className="h-4 w-4" />}
                            {category.icon === "star" && <Star className="h-4 w-4" />}
                            {category.icon === "clock" && <Clock className="h-4 w-4" />}
                          </span>
                        )}
                        {category.name}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-1 px-3 text-sm font-semibold">Resources</h4>
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/docs/api-reference"
                    className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    API Reference
                  </Link>
                  <Link
                    href="/docs/tutorials"
                    className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Tutorials
                  </Link>
                  <Link
                    href="/docs/faqs"
                    className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <Suspense>{children}</Suspense>
          </div>
        </main>
      </div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Big Based. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
