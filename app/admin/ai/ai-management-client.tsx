"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Bot, Database, Search, Upload, Settings, Play, RefreshCw, CheckCircle, Edit, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AIManagementClient() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [testQuery, setTestQuery] = useState("")
  const [testResponse, setTestResponse] = useState("")
  const [sampleContent, setSampleContent] = useState(
    "America is a nation founded on principles of liberty and freedom.",
  )
  const [contentContext, setContentContext] = useState("Conservative political article")
  const [writingResults, setWritingResults] = useState<any>(null)
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

  const handleWritingAssistance = async () => {
    if (!sampleContent.trim()) return

    try {
      // Simulate API call to writing assistant
      // In production, this would call the actual API endpoint
      setWritingResults({
        clarity: {
          score: 8.2,
          suggestions: [
            "Consider breaking the second paragraph into shorter sentences",
            "Add a clear thesis statement at the beginning",
          ],
        },
        messaging: {
          score: 9.1,
          suggestions: [
            "Strengthen the connection to traditional values",
            "Include a historical reference to founding principles",
          ],
        },
        examples: {
          suggestions: ["Add statistics on religious freedom", "Reference a founding father quote on liberty"],
        },
        cta: {
          score: 7.5,
          suggestions: ["Make the call-to-action more specific", "Add urgency to the final paragraph"],
        },
      })

      toast({
        title: "Analysis Complete",
        description: "Writing assistance generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze content",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Features</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                6 Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="indexing">Content Indexing</TabsTrigger>
          <TabsTrigger value="search">Search Testing</TabsTrigger>
          <TabsTrigger value="chat">Chat Testing</TabsTrigger>
          <TabsTrigger value="writing">Writing Assistant</TabsTrigger>
          <TabsTrigger value="domains">Domain AI</TabsTrigger>
          <TabsTrigger value="community">Community AI</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
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

          <Card>
            <CardHeader>
              <CardTitle>AI Feature Configuration</CardTitle>
              <CardDescription>Enable or disable AI features across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">RAG-Powered Chat Assistant</Label>
                    <p className="text-sm text-muted-foreground">Knowledge base-backed AI assistant</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">AI Writing Assistant</Label>
                    <p className="text-sm text-muted-foreground">Content optimization and suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Smart Domain Recommendations</Label>
                    <p className="text-sm text-muted-foreground">AI-powered domain suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">AI Community Moderator</Label>
                    <p className="text-sm text-muted-foreground">Automated content moderation</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Documentation AI</Label>
                    <p className="text-sm text-muted-foreground">Auto-generated documentation</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Smart Affiliate Matching</Label>
                    <p className="text-sm text-muted-foreground">AI-powered affiliate recommendations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
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

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Content Types</span>
                  <span className="text-muted-foreground">Indexed / Total</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Documentation</span>
                    <span>42/42</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Blog Posts</span>
                    <span>18/24</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Community Posts</span>
                    <span>156/230</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Product Descriptions</span>
                    <span>85/85</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
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

        <TabsContent value="writing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Writing Assistant</CardTitle>
              <CardDescription>Test the AI writing assistant for content optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-context">Content Context</Label>
                <Select defaultValue={contentContext} onValueChange={setContentContext}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative political article">Conservative political article</SelectItem>
                    <SelectItem value="Christian values blog post">Christian values blog post</SelectItem>
                    <SelectItem value="Patriotic newsletter">Patriotic newsletter</SelectItem>
                    <SelectItem value="Digital sovereignty guide">Digital sovereignty guide</SelectItem>
                    <SelectItem value="Community guidelines">Community guidelines</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-content">Sample Content</Label>
                <Textarea
                  id="sample-content"
                  value={sampleContent}
                  onChange={(e) => setSampleContent(e.target.value)}
                  placeholder="Enter content to analyze..."
                  rows={5}
                />
                <Button onClick={handleWritingAssistance} className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Analyze Content
                </Button>
              </div>

              {writingResults && (
                <div className="space-y-4 mt-4">
                  <h3 className="font-medium">Analysis Results</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Clarity & Engagement</h4>
                        <span className="text-sm">{writingResults.clarity.score}/10</span>
                      </div>
                      <Progress value={writingResults.clarity.score * 10} className="h-2" />
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {writingResults.clarity.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Conservative Messaging</h4>
                        <span className="text-sm">{writingResults.messaging.score}/10</span>
                      </div>
                      <Progress value={writingResults.messaging.score * 10} className="h-2" />
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {writingResults.messaging.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Suggested Examples & Data</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {writingResults.examples.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Call-to-Action Effectiveness</h4>
                        <span className="text-sm">{writingResults.cta.score}/10</span>
                      </div>
                      <Progress value={writingResults.cta.score * 10} className="h-2" />
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {writingResults.cta.suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Domain Recommendations</CardTitle>
              <CardDescription>AI-powered domain suggestions based on user profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Domain Recommendation Engine</Label>
                    <p className="text-sm text-muted-foreground">Personalized domain suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Recent Recommendations</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">patriotvoice.com</p>
                        <p className="text-sm text-muted-foreground">Conservative media platform</p>
                      </div>
                      <Badge>98% Match</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">faithfreedom.org</p>
                        <p className="text-sm text-muted-foreground">Religious liberty organization</p>
                      </div>
                      <Badge>95% Match</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">americanvalues.net</p>
                        <p className="text-sm text-muted-foreground">Traditional values community</p>
                      </div>
                      <Badge>92% Match</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Top Categories</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Patriotic</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>Faith-based</span>
                        <span>28%</span>
                      </div>
                      <Progress value={28} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>Conservative Media</span>
                        <span>24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Trending Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">liberty</Badge>
                      <Badge variant="outline">patriot</Badge>
                      <Badge variant="outline">freedom</Badge>
                      <Badge variant="outline">america</Badge>
                      <Badge variant="outline">faith</Badge>
                      <Badge variant="outline">truth</Badge>
                      <Badge variant="outline">sovereign</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Community Moderator</CardTitle>
              <CardDescription>Automated content moderation and community insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automated Moderation</Label>
                    <p className="text-sm text-muted-foreground">AI-powered content review</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Content Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">+5% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Value Alignment</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">96%</div>
                      <p className="text-xs text-muted-foreground">+2% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Flagged Content</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">3%</div>
                      <p className="text-xs text-muted-foreground">-1% from last week</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Recent Moderation Actions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Content flagged for review</p>
                        <p className="text-xs text-muted-foreground">Potential violation of community guidelines</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Review
                      </Badge>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">High-quality post promoted</p>
                        <p className="text-xs text-muted-foreground">Exceptional content on digital sovereignty</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Promoted
                      </Badge>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Content automatically approved</p>
                        <p className="text-xs text-muted-foreground">Meets all community standards</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approved
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Analytics Dashboard</CardTitle>
              <CardDescription>Performance metrics for AI features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Chat Queries</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">+18% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Content Analyzed</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">356</div>
                      <p className="text-xs text-muted-foreground">+24% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Domain Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">+12% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Avg. Response Time</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-2xl font-bold">1.2s</div>
                      <p className="text-xs text-muted-foreground">-0.3s from last week</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">AI Feature Usage</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Chat Assistant</span>
                        <span>42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Writing Assistant</span>
                        <span>28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Domain Recommendations</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Community Moderation</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Documentation AI</span>
                        <span>5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Top Chat Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Digital Sovereignty</span>
                          <span>32%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conservative Values</span>
                          <span>28%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Platform Features</span>
                          <span>18%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Account Help</span>
                          <span>12%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Other</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">User Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-5xl font-bold">94%</div>
                          <p className="text-sm text-muted-foreground mt-2">Positive feedback</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
