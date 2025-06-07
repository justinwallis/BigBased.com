import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDocumentationCategoryBySlug, getArticlesByCategory } from "@/app/actions/documentation-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, Bookmark, Star, Clock } from "lucide-react"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getDocumentationCategoryBySlug(params.category)

  if (!category) {
    return {
      title: "Category Not Found | Big Based Documentation",
      description: "The requested documentation category could not be found.",
    }
  }

  return {
    title: `${category.name} | Big Based Documentation`,
    description: category.description || `Browse all ${category.name.toLowerCase()} documentation.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getDocumentationCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(category.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/docs" className="text-sm text-muted-foreground hover:underline">
            Documentation
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm">{category.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {category.icon === "book-open" && <BookOpen className="h-6 w-6 text-primary" />}
          {category.icon === "file-text" && <FileText className="h-6 w-6 text-primary" />}
          {category.icon === "bookmark" && <Bookmark className="h-6 w-6 text-primary" />}
          {category.icon === "star" && <Star className="h-6 w-6 text-primary" />}
          {category.icon === "clock" && <Clock className="h-6 w-6 text-primary" />}
          {!category.icon && <BookOpen className="h-6 w-6 text-primary" />}
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article) => (
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
                  <Link href={`/docs/${category.slug}/${article.slug}`}>
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">No articles in this category yet.</p>
            <Button asChild className="mt-4">
              <Link href="/docs">Browse All Documentation</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
