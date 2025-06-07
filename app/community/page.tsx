import type { Metadata } from "next"
import Link from "next/link"
import { getCommunityCategories, getRecentTopics, getTrendingTopics } from "@/app/actions/community-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, TrendingUp, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Community | Big Based",
  description: "Join the Big Based community to discuss features, get help, and connect with other users.",
}

export default async function CommunityPage() {
  const categories = await getCommunityCategories()
  const recentTopics = await getRecentTopics()
  const trendingTopics = await getTrendingTopics()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome to the Community</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with other Big Based users, share ideas, and get help
        </p>
      </div>

      {/* Categories Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Browse Categories</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#3B82F6" }} />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 mb-4">
                  {category.description || `Discussions about ${category.name.toLowerCase()}.`}
                </CardDescription>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href={`/community/${category.slug}`}>
                    <span>Browse Topics</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent and Trending Topics */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Recent Topics</h3>
          </div>
          <div className="space-y-3">
            {recentTopics.length > 0 ? (
              recentTopics.map((topic) => (
                <Card key={topic.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/community/${topic.category?.slug}/${topic.slug}`}
                        className="font-medium hover:text-primary line-clamp-2"
                      >
                        {topic.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {topic.category?.name}
                        </Badge>
                        <span>by {topic.author?.name || "Anonymous"}</span>
                        <span>•</span>
                        <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
                      <MessageCircle className="h-4 w-4" />
                      <span>{topic.post_count || 0}</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent topics yet.</p>
            )}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Trending Topics</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <Card key={topic.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/community/${topic.category?.slug}/${topic.slug}`}
                        className="font-medium hover:text-primary line-clamp-2"
                      >
                        {topic.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {topic.category?.name}
                        </Badge>
                        <span>{topic.view_count} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
                      <MessageCircle className="h-4 w-4" />
                      <span>{topic.post_count || 0}</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No trending topics yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,234</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">567</div>
              <div className="text-sm text-muted-foreground">Topics Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,890</div>
              <div className="text-sm text-muted-foreground">Posts Made</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
