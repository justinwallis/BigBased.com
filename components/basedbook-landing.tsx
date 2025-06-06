"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Star, Search, Download, Heart } from "lucide-react"
import Link from "next/link"

export default function BasedBookLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-purple-900 mb-6 leading-tight">
              Welcome to <span className="text-purple-600">BasedBook</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 mb-8 leading-relaxed">
              Your premier destination for conservative literature, educational resources, and community-driven content
              that shapes minds and strengthens values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Library
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-900">10,000+</div>
                <div className="text-purple-600">Books & Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-900">500+</div>
                <div className="text-purple-600">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-900">50,000+</div>
                <div className="text-purple-600">Readers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Conservative Learning</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover, learn, and connect with a comprehensive platform designed for conservative minds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Vast Digital Library</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access thousands of carefully curated books, articles, and educational materials from leading
                  conservative thinkers and authors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Author Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with conservative authors, thought leaders, and intellectuals. Follow their work and
                  engage in meaningful discussions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Curated Collections</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore expertly organized collections on topics like faith, freedom, economics, and cultural
                  preservation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find exactly what you're looking for with our advanced search capabilities and intelligent content
                  recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Offline Reading</h3>
                <p className="text-gray-600 leading-relaxed">
                  Download content for offline reading. Take your conservative library with you wherever you go.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Community Driven</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join a thriving community of like-minded readers. Share insights, discuss ideas, and grow together in
                  knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Expand Your Conservative Library?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who are already discovering, learning, and growing with BasedBook's comprehensive
            conservative content platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Reading Today
              </Button>
            </Link>
            <Link href="/library">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
              >
                Explore Library
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
