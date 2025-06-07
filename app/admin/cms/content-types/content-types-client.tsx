"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Edit, Trash2, FileText, Settings, Eye } from "lucide-react"
import { getContentTypes, deleteContentType, type ContentType } from "@/app/actions/cms-actions"
import Link from "next/link"

export default function ContentTypesClient() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchContentTypes()
  }, [])

  const fetchContentTypes = async () => {
    setLoading(true)
    try {
      const result = await getContentTypes()
      if (result.success) {
        setContentTypes(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch content types",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the "${name}" content type? This will also delete all associated content.`,
      )
    ) {
      return
    }

    try {
      const result = await deleteContentType(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Content type deleted successfully",
        })
        setContentTypes(contentTypes.filter((ct) => ct.id !== id))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete content type",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (contentTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Content Types</h3>
          <p className="text-muted-foreground text-center mb-4">
            Get started by creating your first content type to define the structure of your content.
          </p>
          <Button asChild>
            <Link href="/admin/cms/content-types/new">Create Content Type</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contentTypes.map((contentType) => (
        <Card key={contentType.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{contentType.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/cms/content-types/${contentType.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/cms/content?type=${contentType.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Content
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/cms/content/new?type=${contentType.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Create Content
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(contentType.id, contentType.name)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="line-clamp-2">
              {contentType.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{contentType.slug}</Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(contentType.created_at).toLocaleDateString()}</p>
              <p>Fields: {Object.keys(contentType.schema?.fields || {}).length}</p>
            </div>

            {/* Show some field info */}
            {contentType.schema?.fields && Object.keys(contentType.schema.fields).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fields:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(contentType.schema.fields)
                    .slice(0, 3)
                    .map(([key, field]: [string, any]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key} ({field.type})
                      </Badge>
                    ))}
                  {Object.keys(contentType.schema.fields).length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{Object.keys(contentType.schema.fields).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/admin/cms/content-types/${contentType.id}`}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/admin/cms/content?type=${contentType.id}`}>
                  <FileText className="h-3 w-3 mr-1" />
                  Content
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
