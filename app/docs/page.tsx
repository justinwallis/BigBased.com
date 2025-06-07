import type { Metadata } from "next"
import Link from "next/link"
import {
  getDocumentationCategories,
  getFeaturedArticles,
  getPopularArticles,
} from "@/app/actions/documentation-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, BookOpen, FileText, Bookmark, Star, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | Big Based",
  description: "Learn how to use the Big Based platform with our comprehensive documentation.",
}

export default async function DocsPage() {
  const categories = await getDocumentationCategories()
  const featuredArticles = await getFeaturedArticles()
  const popularArticles = await getPopularArticles()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know about using the Big Based platform.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search documentation..." className="pl-10 py-6 text-lg" />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {category.icon === "book-open" && <BookOpen className="h-5 w-5 text-primary" />}
                  {category.icon === "file-text" && <FileText className="h-5 w-5 text-primary" />}
                  {category.icon === "bookmark" && <Bookmark className="h-5 w-5 text-primary" />}
                  {category.icon === "star" && <Star className="h-5 w-5 text-primary" />}
                  {category.icon === "clock" && <Clock className="h-5 w-5 text-primary" />}
                  {!category.icon && <BookOpen className="h-5 w-5 text-primary" />}
                  <CardTitle>{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 h-10">
                  {category.description || `Browse all ${category.name.toLowerCase()} documentation.`}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href={`/docs/${category.slug}`}>
                    <span>Browse Documentation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.length > 0 ? (
            featuredArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt || article.content.substring(0, 150) + "..."}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full justify-between">
                    <Link href={`/docs/${article.category?.slug}/${article.slug}`}>
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No featured articles yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularArticles.length > 0 ? (
            popularArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt || article.content.substring(0, 150) + "..."}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" className="w-full justify-between">
                    <Link href={`/docs/${article.category?.slug}/${article.slug}`}>
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No popular articles yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 bg-muted rounded-lg p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Need Help?</h2>
          <p className="mt-2 text-muted-foreground">
            Can't find what you're looking for? Our community is here to help.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/community">Visit Community Forum</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
