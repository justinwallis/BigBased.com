// BasedBook exclusive page
import { siteConfig } from "@/lib/site-config"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, BookOpen, Users } from "lucide-react"

export default function AuthorsPage() {
  // Only accessible from BasedBook
  if (!siteConfig.isBasedBook) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-4">Conservative Authors</h1>
        <p className="text-xl text-purple-700">
          Connect with leading conservative thinkers, writers, and intellectuals
        </p>
      </div>

      {/* Featured Authors */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Authors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Author Name {i}</h3>
                <p className="text-gray-600 mb-4">Constitutional Scholar & Author</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    12 Books
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    5.2k Followers
                  </span>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Follow Author</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Authors Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Authors</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">Author {i}</h4>
                <p className="text-sm text-gray-600 mb-3">Specialty Area</p>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-600">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
