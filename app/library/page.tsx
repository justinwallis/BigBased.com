import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Filter } from "lucide-react"
import type { Metadata } from "next"

// Static metadata to prevent build errors
export const metadata: Metadata = {
  title: "Library | BasedBook",
  description: "Discover thousands of conservative books, articles, and educational resources",
}

export default function LibraryPage() {
  // Simple domain check without complex configuration
  const isBasedBook = process.env.NEXT_PUBLIC_DOMAIN?.includes("basedbook") || false

  // Only accessible from BasedBook
  if (!isBasedBook) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-4">BasedBook Library</h1>
        <p className="text-xl text-purple-700">
          Discover thousands of conservative books, articles, and educational resources
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books, authors, topics..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="border-purple-300 text-purple-600">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Featured Collections */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Constitutional Foundations</h3>
              <p className="text-gray-600 mb-4">Essential readings on American constitutional principles</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Explore Collection</Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Faith & Philosophy</h3>
              <p className="text-gray-600 mb-4">Exploring the intersection of faith and reason</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Explore Collection</Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Economic Freedom</h3>
              <p className="text-gray-600 mb-4">Free market principles and economic liberty</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Explore Collection</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Additions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Additions</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-purple-200">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-purple-100 rounded mb-4"></div>
                <h4 className="font-semibold mb-2">Book Title {i}</h4>
                <p className="text-sm text-gray-600 mb-2">Author Name</p>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  Read Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
