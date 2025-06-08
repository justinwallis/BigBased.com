"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Star, TrendingUp, DollarSign } from "lucide-react"

export default function AIDomainRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/smart-domains", {
        method: "POST",
      })

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRecommendations()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            AI Domain Recommendations
          </CardTitle>
          <Button onClick={getRecommendations} disabled={isLoading} size="sm">
            {isLoading ? "Analyzing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.slice(0, 5).map((rec, i) => (
              <div key={i} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rec.domain}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      {rec.score}/10
                    </Badge>
                    {rec.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.reasoning}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {rec.tags?.map((tag: string, j: number) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {rec.estimatedValue && (
                    <div className="flex items-center text-sm text-green-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {rec.estimatedValue}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Getting personalized domain recommendations...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
