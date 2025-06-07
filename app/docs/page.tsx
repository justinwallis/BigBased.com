import type { Metadata } from "next"
import Link from "next/link"
import {
  getDocumentationCategories,
  getFeaturedArticles,
  getPopularArticles,
} from "@/app/actions/documentation-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Code } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | Big Based",
  description: "Learn how to use the Big Based platform with our comprehensive documentation.",
}

export default async function DocsPage() {
  const categories = await getDocumentationCategories()
  const featuredArticles = await getFeaturedArticles()
  const popularArticles = await getPopularArticles()

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Big Based Documentation</h1>
            <p className="text-xl text-gray-400">
              Everything you need to build, deploy, and scale your applications on the Big Based platform.
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Quick Start</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 mb-4">
                  Get up and running with Big Based in minutes.
                </CardDescription>
                <Button asChild variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <Link href="/docs/getting-started/quick-start">
                    Start Building
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 mb-4">
                  Learn about authentication, MFA, and security best practices.
                </CardDescription>
                <Button asChild variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <Link href="/docs/security-authentication">
                    Security Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Code className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">API Reference</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 mb-4">
                  Complete API documentation and integration guides.
                </CardDescription>
                <Button asChild variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                  <Link href="/docs/api-integration">
                    View API Docs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Featured Articles</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {featuredArticles.slice(0, 4).map((article) => (
                  <Link
                    key={article.id}
                    href={`/docs/${article.category?.slug}/${article.slug}`}
                    className="block p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                  >
                    <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {article.excerpt || article.content.substring(0, 120) + "..."}
                    </p>
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <span>{article.category?.name}</span>
                      <span className="mx-2">•</span>
                      <span>{article.view_count} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Browse Documentation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/docs/${category.slug}`}
                  className="block p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {category.description || `Learn about ${category.name.toLowerCase()}`}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Table of Contents */}
      <aside className="hidden xl:block w-64 p-8 border-l border-gray-800">
        <div className="sticky top-8">
          <h3 className="text-sm font-semibold text-white mb-4">On this page</h3>
          <nav className="space-y-2 text-sm">
            <a href="#quick-start" className="block text-gray-400 hover:text-white transition-colors">
              Quick Start
            </a>
            <a href="#featured" className="block text-gray-400 hover:text-white transition-colors">
              Featured Articles
            </a>
            <a href="#browse" className="block text-gray-400 hover:text-white transition-colors">
              Browse Documentation
            </a>
            <a href="#support" className="block text-gray-400 hover:text-white transition-colors">
              Get Support
            </a>
          </nav>
        </div>
      </aside>
    </div>
  )
}
