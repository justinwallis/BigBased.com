import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/app/actions/documentation-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ThumbsUp, ThumbsDown, Copy, ExternalLink } from "lucide-react"
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

// Extract headings from HTML content for table of contents
function extractHeadings(htmlContent: string) {
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi
  const headings: { level: number; text: string; id: string }[] = []
  let match

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = Number.parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, "") // Remove HTML tags
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    headings.push({ level, text, id })
  }

  return headings
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

  const headings = extractHeadings(article.content)

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href={`/docs/${params.category}`}
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {article.category?.name}
            </Link>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {article.category?.name}
              </Badge>
              {article.is_featured && (
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>

            {article.excerpt && <p className="text-xl text-gray-400 mb-6">{article.excerpt}</p>}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{article.view_count} views</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Version {article.version}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Article Actions */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Was this helpful?</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Yes
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    No
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Edit on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Table of Contents */}
      <aside className="hidden xl:block w-64 p-8 border-l border-gray-800">
        <div className="sticky top-8">
          <h3 className="text-sm font-semibold text-white mb-4">On this page</h3>
          {headings.length > 0 ? (
            <nav className="space-y-2 text-sm">
              {headings.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  className={`block text-gray-400 hover:text-white transition-colors ${
                    heading.level > 2 ? "ml-4" : ""
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-gray-500">No headings found</p>
          )}

          {/* Additional Actions */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-3">More resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="/community" className="block text-gray-400 hover:text-white transition-colors">
                Community Forum
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Support
              </Link>
              <Link href="/docs" className="block text-gray-400 hover:text-white transition-colors">
                All Documentation
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
