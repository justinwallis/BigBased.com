"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Bot, Database, Search, Upload, Settings, Play, RefreshCw, CheckCircle } from "lucide-react"

export default function AIManagementClient() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [testQuery, setTestQuery] = useState("")
  const [testResponse, setTestResponse] = useState("")
  const { toast } = useToast()

  const handleInitialize = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/ai/initialize", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "AI system initialized successfully",
        })
      } else {
        throw new Error("Failed to initialize")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize AI system",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const handleIndexContent = async () => {
    setIsIndexing(true)
    try {
      const response = await fetch("/api/ai/index-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Indexed ${data.indexed_count} content items`,
        })
      } else {
        throw new Error(data.error || "Failed to index content")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to index content",
        variant: "destructive",
      })
    } finally {
      setIsIndexing(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResults(data.results)
      } else {
        throw new Error(data.error || "Search failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      })
    }
  }

  const handleTestChat = async () => {
    if (!testQuery.trim()) return

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: testQuery,
          domain: "bigbased.com",
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let result = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += decoder.decode(value)
          }
        }

        setTestResponse(result)
      } else {
        throw new Error("Chat test failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Chat test failed",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vector Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Qdrant Connected</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Provider</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Groq Ready</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Embeddings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">OpenAI Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="indexing">Content Indexing</TabsTrigger>
          <TabsTrigger value="search">Search Testing</TabsTrigger>
          <TabsTrigger value="chat">Chat Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Initialize AI System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Initialize Qdrant collections and set up the RAG system for your content.
              </p>
              <Button onClick={handleInitialize} disabled={isInitializing} className="w-full">
                {isInitializing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Initialize AI System
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Indexing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Index your CMS content to make it searchable by the AI assistant.
              </p>
              <Button onClick={handleIndexContent} disabled={isIndexing} className="w-full">
                {isIndexing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Indexing Content...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Index All Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-query">Search Query</Label>
                <div className="flex gap-2">
                  <Input
                    id="search-query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search query..."
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{result.title}</h4>
                          <span className="text-xs text-muted-foreground">Score: {result.score.toFixed(3)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{result.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-query">Test Query</Label>
                <Textarea
                  id="test-query"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  placeholder="Ask a question to test the AI assistant..."
                  rows={3}
                />
                <Button onClick={handleTestChat} className="w-full">
                  <Bot className="mr-2 h-4 w-4" />
                  Test Chat
                </Button>
              </div>

              {testResponse && (
                <div className="space-y-2">
                  <Label>AI Response</Label>
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <p className="text-sm whitespace-pre-wrap">{testResponse}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
