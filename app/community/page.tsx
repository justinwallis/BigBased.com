import type { Metadata } from "next"
import Link from "next/link"
import { getCommunityCategories, getRecentTopics, getTrendingTopics } from "@/app/actions/community-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  TrendingUp,
  Search,
  Plus,
  ChevronDown,
  ExternalLink,
  Calendar,
  Users,
  BookOpen,
  HelpCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Community | Big Based",
  description: "Join the Big Based community to discuss features, get help, and connect with other users.",
}

export default async function CommunityPage() {
  const categories = await getCommunityCategories()
  const recentTopics = await getRecentTopics()
  const trendingTopics = await getTrendingTopics()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Big Based Community</h1>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 pr-12 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
            />
            <div className="absolute right-3 top-3 text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">⌘K</div>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/community/categories" className="hover:text-white transition-colors">
            Categories
          </Link>
          <span>›</span>
          <Link href="/community/tags" className="hover:text-white transition-colors">
            Tags
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button className="text-white border-b-2 border-white pb-1">Fresh</button>
          <button className="text-gray-400 hover:text-white transition-colors">Latest</button>
          <button className="text-gray-400 hover:text-white transition-colors">Hot</button>
        </div>

        {/* New Topic Button */}
        <div className="flex justify-end mb-8">
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/community/new">
              <Plus className="h-4 w-4 mr-2" />
              New Topic
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* News Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">News</h2>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Announcements */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Stay updated with the latest news and important updates from Big Based and our community
                </CardDescription>
              </CardContent>
            </Card>

            {/* Events */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Find out about upcoming live sessions, workshops, and meetups. And watch recordings of past events
                </CardDescription>
              </CardContent>
            </Card>

            {/* Changelog */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Changelog
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Stay updated on the latest changes to the Big Based platform as soon as they happen.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Community</h2>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Discussions */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Join in conversations, share opinions, and brainstorm with other community members
                </CardDescription>
              </CardContent>
            </Card>

            {/* Showcase */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Showcase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Share what you shipped, get feedback, and inspire creativity. This category is the place to show off
                  personal projects, portfolio pieces, and new ideas
                </CardDescription>
              </CardContent>
            </Card>

            {/* General */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  General discussions about the platform, community, and anything else that doesn't fit in other
                  categories
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Support</h2>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Help */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Get help with questions, troubleshoot issues, and find solutions from more experienced community
                  members
                </CardDescription>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Ask for help, share prompt ideas, and chat about projects with the community
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
