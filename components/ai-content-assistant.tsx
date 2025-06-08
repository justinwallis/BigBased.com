"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wand2, Tag, FileText, TrendingUp } from "lucide-react"

interface ContentAssistantProps {
  content?: string
  title?: string
  onSEOGenerated?: (seo: any) => void
  onCategorySelected?: (category: string) => void
  onSummaryGenerated?: (summary: string) => void
}

export default function AIContentAssistant({
  content = "",
  title = "",
  onSEOGenerated,
  onCategorySelected,
  onSummaryGenerated,
}: ContentAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSEO, setGeneratedSEO] = useState<any>(null)
  const [suggestedCategory, setSuggestedCategory] = useState("")
  const [generatedSummary, setGeneratedSummary] = useState("")

  const generateSEO = async () => {
    if (!content || !title) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      })

      const seo = await response.json()
      setGeneratedSEO(seo)
      onSEOGenerated?.(seo)
    } catch (error) {
      console.error("Error generating SEO:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const categorizeContent = async () => {
    if (!content) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      const { category } = await response.json()
      setSuggestedCategory(category)
      onCategorySelected?.(category)
    } catch (error) {
      console.error("Error categorizing content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSummary = async () => {
    if (!content) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      const { summary } = await response.json()
      setGeneratedSummary(summary)
      onSummaryGenerated?.(summary)
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Content Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="seo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="seo" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generate SEO Metadata</h3>
              <Button onClick={generateSEO} disabled={isGenerating || !content} size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>

            {generatedSEO && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{generatedSEO.description}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Keywords</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedSEO.keywords?.split(",").map((keyword: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Auto-Categorize Content</h3>
              <Button onClick={categorizeContent} disabled={isGenerating || !content} size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Categorize
              </Button>
            </div>

            {suggestedCategory && (
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-xs font-medium text-muted-foreground">Suggested Category</label>
                <Badge className="mt-2 block w-fit">{suggestedCategory}</Badge>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generate Summary</h3>
              <Button onClick={generateSummary} disabled={isGenerating || !content} size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Summarize
              </Button>
            </div>

            {generatedSummary && (
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-xs font-medium text-muted-foreground">Generated Summary</label>
                <p className="text-sm mt-2">{generatedSummary}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
