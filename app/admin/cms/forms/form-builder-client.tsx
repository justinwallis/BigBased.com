"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FormInput, MoreHorizontal, Edit, Trash2, Eye, BarChart3 } from "lucide-react"

// Mock data for now
const mockForms = [
  {
    id: "1",
    name: "Contact Form",
    description: "General contact form for website visitors",
    status: "published",
    submissions: 45,
    created_at: "2024-01-15",
    fields: 5,
  },
  {
    id: "2",
    name: "Newsletter Signup",
    description: "Email subscription form",
    status: "draft",
    submissions: 0,
    created_at: "2024-01-20",
    fields: 2,
  },
  {
    id: "3",
    name: "Event Registration",
    description: "Registration form for upcoming events",
    status: "published",
    submissions: 23,
    created_at: "2024-01-18",
    fields: 8,
  },
]

export default function FormBuilderClient() {
  const [forms] = useState(mockForms)

  return (
    <div className="space-y-4">
      {forms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FormInput className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Forms Created</h3>
            <p className="text-muted-foreground text-center mb-4">Get started by creating your first custom form</p>
            <Button>Create Your First Form</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <CardDescription>{form.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Submissions
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={form.status === "published" ? "default" : "secondary"}>{form.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fields</span>
                    <span>{form.fields}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submissions</span>
                    <span>{form.submissions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(form.created_at).toLocaleDateString()}</span>
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
