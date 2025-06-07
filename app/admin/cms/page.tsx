"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CMSAdminPage() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/cms/pages")
      const data = await response.json()
      setPages(data.docs || [])
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPage = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPage),
      })

      if (response.ok) {
        setNewPage({ title: "", slug: "", content: "", status: "draft" })
        fetchPages()
      }
    } catch (error) {
      console.error("Error creating page:", error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Management System</h1>

      {/* Create New Page */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Page Title"
            value={newPage.title}
            onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
          />
          <Input
            placeholder="Page Slug"
            value={newPage.slug}
            onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
          />
          <Textarea
            placeholder="Page Content"
            value={newPage.content}
            onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
            rows={4}
          />
          <Select value={newPage.status} onValueChange={(value) => setNewPage({ ...newPage, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createPage} disabled={creating}>
            {creating ? "Creating..." : "Create Page"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading pages...</p>
          ) : pages.length === 0 ? (
            <p>No pages found. Create your first page above!</p>
          ) : (
            <div className="space-y-4">
              {pages.map((page: any) => (
                <div key={page.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-gray-600">Slug: {page.slug}</p>
                  <p className="text-sm text-gray-600">Status: {page.status}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
