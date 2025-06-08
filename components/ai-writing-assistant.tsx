"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Wand2, TrendingUp, Target } from "lucide-react"

interface WritingAssistantProps {
  content: string
  context?: string
  onSuggestionApply?: (suggestion: string) => void
}

export default function AIWritingAssistant({ content, context = "", onSuggestionApply }: WritingAssistantProps) {
  const [suggestions, setSuggestions] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getSuggestions = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, context }),
      })

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error("Error getting suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!content.trim()) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Wand2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Start writing to get AI assistance...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Writing Assistant
          </CardTitle>
          <Button onClick={getSuggestions} disabled={isLoading} size="sm">
            {isLoading ? "Analyzing..." : "Get Suggestions"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions && (
          <>
            {/* Clarity Improvements */}
            {suggestions.clarity && suggestions.clarity.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <h4 className="font-medium">Clarity & Engagement</h4>
                </div>
                {suggestions.clarity.map((suggestion: string, i: number) => (
                  <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Conservative Messaging */}
            {suggestions.messaging && suggestions.messaging.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Conservative Messaging</h4>
                </div>
                {suggestions.messaging.map((suggestion: string, i: number) => (
                  <div key={i} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examples & Data */}
            {suggestions.examples && suggestions.examples.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Examples & Data</h4>
                </div>
                {suggestions.examples.map((suggestion: string, i: number) => (
                  <div key={i} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action */}
            {suggestions.cta && (
              <div className="space-y-2">
                <h4 className="font-medium">Call-to-Action Suggestions</h4>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200">
                  <p className="text-sm">{suggestions.cta}</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
