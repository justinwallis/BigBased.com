"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Play, Copy } from "lucide-react"

// Mock data for query presets
const mockQueries = [
  {
    id: "1",
    name: "Published Articles",
    description: "All published blog articles from the last 30 days",
    query: {
      content_type: "article",
      status: "published",
      date_range: "30d",
    },
    created_at: "2024-01-15",
    last_used: "2024-01-22",
    usage_count: 15,
  },
  {
    id: "2",
    name: "Draft Content",
    description: "All content items in draft status",
    query: {
      status: "draft",
    },
    created_at: "2024-01-18",
    last_used: "2024-01-21",
    usage_count: 8,
  },
  {
    id: "3",
    name: "Featured Pages",
    description: "Pages marked as featured content",
    query: {
      content_type: "page",
      featured: true,
      status: "published",
    },
    created_at: "2024-01-20",
    last_used: "2024-01-20",
    usage_count: 3,
  },
]

export default function QueryPresetsClient() {
  const [queries] = useState(mockQueries)

  const handleRunQuery = (query: any) => {
    console.log("Running query:", query)
    // In a real implementation, this would execute the query and show results
  }

  const handleCopyQuery = (query: any) => {
    navigator.clipboard.writeText(JSON.stringify(query.query, null, 2))
  }

  return (
    <div className="space-y-4">
      {queries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Query Presets</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first query preset to save frequently used searches
            </p>
            <Button>Create Query Preset</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{query.name}</CardTitle>
                    <CardDescription>{query.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRunQuery(query)}>
                        <Play className="h-4 w-4 mr-2" />
                        Run Query
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyQuery(query)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Query
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-sm overflow-x-auto">{JSON.stringify(query.query, null, 2)}</pre>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Used {query.usage_count} times</span>
                      <span>•</span>
                      <span>Last used: {new Date(query.last_used).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" onClick={() => handleRunQuery(query)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Query
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
