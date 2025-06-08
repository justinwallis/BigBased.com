import type { Metadata } from "next"
import { AIChatWidget } from "@/components/ai/ai-chat-widget"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Search, MessageSquare, BookOpen, Zap, Shield } from "lucide-react"
import { GoogleDriveSync } from "@/components/ai/google-drive-sync"

export const metadata: Metadata = {
  title: "AI Assistant | Big Based",
  description:
    "Intelligent search and assistance powered by AI. Get instant answers from our comprehensive knowledge base.",
}

export default function AIPage() {
  // In a real app, you'd get this from your domain/tenant resolution
  const tenantId = "bigbased"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              BigBased
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                AI Assistant
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Get instant, intelligent answers from our comprehensive knowledge base. Search through documentation,
              community discussions, and curated content with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Knowledge Base
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Intelligent Search & Assistance</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI assistant understands context and provides accurate, source-backed answers from across the BigBased
            platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Semantic Search</CardTitle>
              <CardDescription>
                Find relevant content based on meaning, not just keywords. Our AI understands context and intent.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Conversational AI</CardTitle>
              <CardDescription>
                Have natural conversations with our AI. Ask follow-up questions and get detailed explanations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Source Citations</CardTitle>
              <CardDescription>
                Every answer includes references to original sources, so you can verify and explore further.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Our knowledge base is continuously updated with the latest content from across the platform.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Privacy Focused</CardTitle>
              <CardDescription>
                Your conversations are private and secure. We respect your privacy and protect your data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Continuous Learning</CardTitle>
              <CardDescription>
                Our AI improves over time, learning from interactions to provide better, more accurate responses.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Google Drive Integration */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Google Drive Integration</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Sync your Google Drive content to make it searchable through our AI assistant.
          </p>
        </div>
        <GoogleDriveSync tenantId={tenantId} />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience AI-Powered Search?</h2>
          <p className="text-xl text-blue-100 mb-8">Start exploring our knowledge base with intelligent assistance.</p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <MessageSquare className="w-5 h-5 mr-2" />
            Open AI Assistant
          </Button>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget tenantId={tenantId} defaultOpen={false} />
    </div>
  )
}
