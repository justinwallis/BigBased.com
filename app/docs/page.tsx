import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Shield, Zap, Building, Code, Users, Star, Clock, TrendingUp } from "lucide-react"
import { getFeaturedArticles, getPopularArticles } from "@/app/actions/documentation-actions"

export default async function DocsHomePage() {
  const [featuredArticles, popularArticles] = await Promise.all([getFeaturedArticles(), getPopularArticles()])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Big Based Documentation</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale your applications on the Big Based platform. From getting
            started guides to advanced enterprise features.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/docs/platform-architecture/quick-start-guide">
                <BookOpen className="w-5 h-5 mr-2" />
                Quick Start Guide
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/api-integration/getting-started">
                <Code className="w-5 h-5 mr-2" />
                API Reference
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Getting Started</CardTitle>
                  <CardDescription>Quick setup and introduction</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/platform-architecture/introduction"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Platform Introduction
                </Link>
                <Link
                  href="/docs/platform-architecture/quick-start-guide"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Quick Start Guide
                </Link>
                <Link
                  href="/docs/platform-architecture/system-requirements"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  System Requirements
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Security</CardTitle>
                  <CardDescription>Authentication and security features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/multi-factor-authentication/setup-guide"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  MFA Setup Guide
                </Link>
                <Link
                  href="/docs/security-features/overview"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Security Overview
                </Link>
                <Link
                  href="/docs/security-features/best-practices"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Best Practices
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Platform Features</CardTitle>
                  <CardDescription>Core platform capabilities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/profile-customization/user-guide"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Profile Customization
                </Link>
                <Link
                  href="/docs/admin-panel-guide/overview"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Admin Panel Guide
                </Link>
                <Link
                  href="/docs/cms-guide/content-management"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Content Management
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Building className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <CardDescription>Advanced enterprise features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/enterprise-knowledge-graph/overview"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Knowledge Graph
                </Link>
                <Link
                  href="/docs/shop-system/setup-guide"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Shop System
                </Link>
                <Link
                  href="/docs/cms-guide/content-management"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  CMS Features
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Code className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-white">API & Integration</CardTitle>
                  <CardDescription>Developer tools and APIs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/api-integration/getting-started"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  API Getting Started
                </Link>
                <Link
                  href="/docs/api-integration/authentication"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  API Authentication
                </Link>
                <Link
                  href="/docs/api-integration/endpoints"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  API Endpoints
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Community</CardTitle>
                  <CardDescription>Community and support resources</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/docs/community-forum/getting-started"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Forum Guide
                </Link>
                <Link href="/community" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Visit Community
                </Link>
                <Link href="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        Featured
                      </Badge>
                      <Badge variant="outline" className="border-gray-700 text-gray-400">
                        {article.category?.name}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                    {article.excerpt && <CardDescription>{article.excerpt}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-blue-400 hover:text-blue-300">
                      <Link href={`/docs/${article.category?.slug}/${article.slug}`}>
                        Read article <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Articles */}
        {popularArticles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Popular Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article) => (
                <Card key={article.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-gray-700 text-gray-400">
                        {article.category?.name}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {article.view_count} views
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                    {article.excerpt && <CardDescription>{article.excerpt}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-blue-400 hover:text-blue-300">
                      <Link href={`/docs/${article.category?.slug}/${article.slug}`}>
                        Read article <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
