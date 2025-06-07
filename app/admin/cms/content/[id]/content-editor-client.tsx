"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEditor, EditorContent } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Clock, CheckCircle, ImageIcon } from "lucide-react"
import { createContentItem, updateContentItem, type ContentItem, type ContentType } from "@/app/actions/cms-actions"
import { editorExtensions, htmlToJson } from "@/lib/tiptap-utils"
import EditorToolbar from "./editor-toolbar"

interface ContentEditorClientProps {
  contentItem: ContentItem | null
  contentTypes: ContentType[]
  isNew: boolean
}

export default function ContentEditorClient({ contentItem, contentTypes, isNew }: ContentEditorClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get the type ID from URL if creating new content
  const typeIdFromUrl = searchParams.get("type")

  // Form state
  const [title, setTitle] = useState(contentItem?.title || "")
  const [slug, setSlug] = useState(contentItem?.slug || "")
  const [contentTypeId, setContentTypeId] = useState(
    contentItem?.content_type_id || typeIdFromUrl || contentTypes[0]?.id || "",
  )
  const [status, setStatus] = useState<"draft" | "published" | "archived">(contentItem?.status || "draft")
  const [seoTitle, setSeoTitle] = useState(contentItem?.seo_title || "")
  const [seoDescription, setSeoDescription] = useState(contentItem?.seo_description || "")
  const [seoKeywords, setSeoKeywords] = useState(
    Array.isArray(contentItem?.seo_keywords) ? contentItem?.seo_keywords.join(", ") : "",
  )
  const [changeSummary, setChangeSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [autoUpdateSlug, setAutoUpdateSlug] = useState(!contentItem?.slug)

  // Initialize the editor
  const editor = useEditor({
    extensions: editorExtensions,
    content: contentItem?.content?.html || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none",
      },
    },
  })

  // Auto-generate slug from title if enabled
  useEffect(() => {
    if (autoUpdateSlug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      )
    }
  }, [title, autoUpdateSlug])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (!contentTypeId) {
      toast({
        title: "Error",
        description: "Content type is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("content_type_id", contentTypeId)
      formData.append("status", status)
      formData.append("seo_title", seoTitle)
      formData.append("seo_description", seoDescription)
      formData.append("seo_keywords", seoKeywords)

      // Get content from editor
      if (editor) {
        const editorContent = editor.getHTML()
        const contentJson = htmlToJson(editorContent)
        formData.append("content", JSON.stringify(contentJson))
      }

      if (!isNew) {
        formData.append("change_summary", changeSummary || "Updated content")
        const result = await updateContentItem(contentItem!.id, formData)

        if (result.success) {
          toast({
            title: "Success",
            description: "Content updated successfully",
          })
        } else {
          throw new Error(result.error || "Failed to update content")
        }
      } else {
        const result = await createContentItem(formData)

        if (result.success) {
          toast({
            title: "Success",
            description: "Content created successfully",
          })
          // Redirect to edit page for the new content
          router.push(`/admin/cms/content/${result.data.id}`)
        } else {
          throw new Error(result.error || "Failed to create content")
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get the selected content type
  const selectedContentType = contentTypes.find((type) => type.id === contentTypeId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/cms/content" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isNew ? "Create Content" : "Edit Content"}</h1>
            <p className="text-muted-foreground">
              {isNew ? "Create new content for your site" : `Editing "${contentItem?.title}"`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setStatus(status === "published" ? "draft" : "published")}>
            {status === "published" ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Set as Draft
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            Save {isSubmitting && "..."}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={autoUpdateSlug} onCheckedChange={setAutoUpdateSlug} id="auto-slug" />
                    <Label htmlFor="auto-slug" className="text-sm text-muted-foreground">
                      Auto-generate
                    </Label>
                  </div>
                </div>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="enter-slug"
                  disabled={autoUpdateSlug}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={contentTypeId} onValueChange={setContentTypeId} disabled={!isNew}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as "draft" | "published" | "archived")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isNew && (
              <div className="space-y-2">
                <Label htmlFor="change-summary">Change Summary</Label>
                <Input
                  id="change-summary"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="Describe your changes (optional)"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <EditorToolbar editor={editor} />
                <div className="border rounded-md p-4 mt-2">
                  <EditorContent editor={editor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="SEO optimized title (leave blank to use content title)"
                  />
                  <p className="text-xs text-muted-foreground">{seoTitle.length} characters (Recommended: 50-60)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description for search engines"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoDescription.length} characters (Recommended: 150-160)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-keywords">Keywords</Label>
                  <Input
                    id="seo-keywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop files or click to browse</p>
                  <Button variant="outline">Browse Media Library</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Featured Content</h3>
                      <p className="text-sm text-muted-foreground">Show this content in featured sections</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Allow Comments</h3>
                      <p className="text-sm text-muted-foreground">Enable commenting on this content</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Author</h3>
                      <p className="text-sm text-muted-foreground">Display author information with content</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
