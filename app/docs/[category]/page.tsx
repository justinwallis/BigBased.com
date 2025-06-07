import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Clock } from "lucide-react"
import { getDocumentationCategoryBySlug, getArticlesByCategory } from "@/app/actions/documentation-actions"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getDocumentationCategoryBySlug(params.category)

  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(category.id)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/docs"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
          {category.description && <p className="text-xl text-gray-400">{category.description}</p>}
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article) => (
              <Card key={article.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {article.is_featured && (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Featured</Badge>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(article.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{article.view_count} views</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-white text-xl">{article.title}</CardTitle>
                  {article.excerpt && <CardDescription className="text-gray-400">{article.excerpt}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-blue-400 hover:text-blue-300">
                    <Link href={`/docs/${params.category}/${article.slug}`}>
                      Read full article <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">No articles found in this category yet.</p>
              <Button variant="outline" asChild>
                <Link href="/docs">Browse all documentation</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
