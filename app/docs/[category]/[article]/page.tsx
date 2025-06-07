import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/app/actions/documentation-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

interface ArticlePageProps {
  params: {
    category: string
    article: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.article, params.category)

  if (!article) {
    return {
      title: "Article Not Found | Big Based Documentation",
      description: "The requested documentation article could not be found.",
    }
  }

  return {
    title: `${article.title} | Big Based Documentation`,
    description: article.excerpt || article.content.substring(0, 160),
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.article, params.category)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link href="/docs" className="text-blue-600 hover:text-blue-800">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{params.category}</Badge>
              {article.featured && <Badge variant="default">Featured</Badge>}
            </div>
            <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
            {article.excerpt && <p className="text-lg text-gray-600 mt-2">{article.excerpt}</p>}
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {formattedDate}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>

        {/* Article Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Was this article helpful?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Yes
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="w-4 h-4 mr-2" />
                No
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
