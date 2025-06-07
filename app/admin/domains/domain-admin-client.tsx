"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { createDomain, updateDomain, deleteDomain } from "@/app/actions/domain-actions"
import { Globe, Plus, Search, Filter, Settings, BarChart3, Eye, Trash2, Edit } from "lucide-react"

interface Domain {
  id: string
  domain: string
  is_active: boolean
  created_at: string
  updated_at: string
  owner_user_id: string | null
  site_type?: string
  custom_branding: {
    site_name?: string
    tagline?: string
    logo_url?: string
    favicon_url?: string
    primary_color?: string
    secondary_color?: string
    custom_css?: string
    features?: {
      enhanced_domains?: boolean
      custom_branding?: boolean
      analytics?: boolean
      custom_navigation?: boolean
      seo_optimization?: boolean
      social_integration?: boolean
      content_management?: boolean
      advanced_features?: boolean
    }
    settings?: {
      maintenance_mode?: boolean
      allow_indexing?: boolean
      enable_comments?: boolean
      enable_social_sharing?: boolean
      enable_newsletter?: boolean
      enable_search?: boolean
      language?: string
      timezone?: string
      currency?: string
    }
    analytics?: {
      google_analytics_id?: string
      facebook_pixel_id?: string
      custom_tracking_code?: string
      enable_heatmaps?: boolean
      enable_session_recording?: boolean
    }
  }
}

interface DomainAdminClientProps {
  initialDomains: Domain[]
}

export default function DomainAdminClient({ initialDomains }: DomainAdminClientProps) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter domains based on search and active status
  const filteredDomains = domains.filter((domain) => {
    const matchesSearch =
      domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.custom_branding?.site_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === null || domain.is_active === filterActive
    return matchesSearch && matchesFilter
  })

  // Group domains by type for better organization
  const groupedDomains = {
    bigbased: filteredDomains.filter((d) => d.domain.includes("bigbased")),
    basedbook: filteredDomains.filter((d) => d.domain.includes("basedbook")),
    custom: filteredDomains.filter((d) => !d.domain.includes("bigbased") && !d.domain.includes("basedbook")),
  }

  const handleCreateDomain = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await createDomain(formData)
      if (result.success) {
        setDomains([result.data, ...domains])
        setIsCreateDialogOpen(false)
        toast({
          title: "Success",
          description: "Domain created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create domain",
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
      setIsLoading(false)
    }
  }

  const handleUpdateDomain = async (domainId: string, formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await updateDomain(domainId, formData)
      if (result.success) {
        setDomains(domains.map((d) => (d.id === domainId ? result.data : d)))
        setIsEditDialogOpen(false)
        setSelectedDomain(null)
        toast({
          title: "Success",
          description: "Domain updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update domain",
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
      setIsLoading(false)
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) return

    setIsLoading(true)
    try {
      const result = await deleteDomain(domainId)
      if (result.success) {
        setDomains(domains.filter((d) => d.id !== domainId))
        toast({
          title: "Success",
          description: "Domain deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete domain",
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
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Domain Management</h1>
          <p className="text-muted-foreground">Manage your {domains.length} configured domains</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
              <DialogDescription>Configure a new domain for your multi-tenant platform</DialogDescription>
            </DialogHeader>
            <form action={handleCreateDomain} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input id="domain" name="domain" placeholder="example.com" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_active" name="is_active" defaultChecked />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Domain"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">Across all networks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.filter((d) => d.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Currently serving traffic</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BigBased Network</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupedDomains.bigbased.length}</div>
            <p className="text-xs text-muted-foreground">BigBased domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Domains</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupedDomains.custom.length}</div>
            <p className="text-xs text-muted-foreground">Custom configurations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={filterActive?.toString() || "all"}
              onValueChange={(value) => {
                setFilterActive(value === "all" ? null : value === "true")
              }}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="true">Active Only</SelectItem>
                <SelectItem value="false">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Domain Groups */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Domains ({filteredDomains.length})</TabsTrigger>
          <TabsTrigger value="bigbased">BigBased ({groupedDomains.bigbased.length})</TabsTrigger>
          <TabsTrigger value="basedbook">BasedBook ({groupedDomains.basedbook.length})</TabsTrigger>
          <TabsTrigger value="custom">Custom ({groupedDomains.custom.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <DomainGrid
            domains={filteredDomains}
            onEdit={(domain) => {
              setSelectedDomain(domain)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteDomain}
          />
        </TabsContent>

        <TabsContent value="bigbased" className="space-y-4">
          <DomainGrid
            domains={groupedDomains.bigbased}
            onEdit={(domain) => {
              setSelectedDomain(domain)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteDomain}
          />
        </TabsContent>

        <TabsContent value="basedbook" className="space-y-4">
          <DomainGrid
            domains={groupedDomains.basedbook}
            onEdit={(domain) => {
              setSelectedDomain(domain)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteDomain}
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <DomainGrid
            domains={groupedDomains.custom}
            onEdit={(domain) => {
              setSelectedDomain(domain)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteDomain}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Domain Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Domain: {selectedDomain?.domain}</DialogTitle>
            <DialogDescription>Configure domain settings, branding, and features</DialogDescription>
          </DialogHeader>
          {selectedDomain && (
            <DomainEditForm
              domain={selectedDomain}
              onSubmit={(formData) => handleUpdateDomain(selectedDomain.id, formData)}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedDomain(null)
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Domain Grid Component
function DomainGrid({
  domains,
  onEdit,
  onDelete,
}: {
  domains: Domain[]
  onEdit: (domain: Domain) => void
  onDelete: (domainId: string) => void
}) {
  if (domains.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No domains found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => (
        <Card key={domain.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{domain.domain}</CardTitle>
              <Badge variant={domain.is_active ? "default" : "secondary"}>
                {domain.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardDescription className="truncate">
              {domain.custom_branding?.site_name || "No site name configured"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(domain.created_at).toLocaleDateString()}</p>
              <p>Type: {domain.site_type || "Custom"}</p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-1">
              {domain.custom_branding?.features?.enhanced_domains && (
                <Badge variant="outline" className="text-xs">
                  Enhanced
                </Badge>
              )}
              {domain.custom_branding?.features?.custom_branding && (
                <Badge variant="outline" className="text-xs">
                  Branded
                </Badge>
              )}
              {domain.custom_branding?.features?.analytics && (
                <Badge variant="outline" className="text-xs">
                  Analytics
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(domain)} className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://${domain.domain}`, "_blank")}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(domain.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Domain Edit Form Component
function DomainEditForm({
  domain,
  onSubmit,
  onCancel,
  isLoading,
}: {
  domain: Domain
  onSubmit: (formData: FormData) => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <form action={onSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="edit_domain">Domain Name</Label>
              <Input id="edit_domain" name="domain" defaultValue={domain.domain} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit_is_active" name="is_active" defaultChecked={domain.is_active} />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                name="site_name"
                defaultValue={domain.custom_branding?.site_name || ""}
                placeholder="My Awesome Site"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                defaultValue={domain.custom_branding?.tagline || ""}
                placeholder="A brief description of your site"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <Input
                  id="primary_color"
                  name="primary_color"
                  type="color"
                  defaultValue={domain.custom_branding?.primary_color || "#1a365d"}
                />
              </div>
              <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <Input
                  id="secondary_color"
                  name="secondary_color"
                  type="color"
                  defaultValue={domain.custom_branding?.secondary_color || "#2d3748"}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                defaultValue={domain.custom_branding?.logo_url || ""}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="custom_css">Custom CSS</Label>
              <Textarea
                id="custom_css"
                name="custom_css"
                defaultValue={domain.custom_branding?.custom_css || ""}
                placeholder="/* Custom CSS styles */"
                rows={6}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Core Features</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enhanced_domains"
                    name="enhanced_domains"
                    defaultChecked={domain.custom_branding?.features?.enhanced_domains}
                  />
                  <Label htmlFor="enhanced_domains">Enhanced Domains</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom_branding_feature"
                    name="custom_branding"
                    defaultChecked={domain.custom_branding?.features?.custom_branding}
                  />
                  <Label htmlFor="custom_branding_feature">Custom Branding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="analytics_feature"
                    name="analytics"
                    defaultChecked={domain.custom_branding?.features?.analytics}
                  />
                  <Label htmlFor="analytics_feature">Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom_navigation"
                    name="custom_navigation"
                    defaultChecked={domain.custom_branding?.features?.custom_navigation}
                  />
                  <Label htmlFor="custom_navigation">Custom Navigation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="seo_optimization"
                    name="seo_optimization"
                    defaultChecked={domain.custom_branding?.features?.seo_optimization}
                  />
                  <Label htmlFor="seo_optimization">SEO Optimization</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <Input
                id="google_analytics_id"
                name="google_analytics_id"
                defaultValue={domain.custom_branding?.analytics?.google_analytics_id || ""}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
              <Input
                id="facebook_pixel_id"
                name="facebook_pixel_id"
                defaultValue={domain.custom_branding?.analytics?.facebook_pixel_id || ""}
                placeholder="123456789012345"
              />
            </div>
            <div>
              <Label htmlFor="custom_tracking_code">Custom Tracking Code</Label>
              <Textarea
                id="custom_tracking_code"
                name="custom_tracking_code"
                defaultValue={domain.custom_branding?.analytics?.custom_tracking_code || ""}
                placeholder="<!-- Custom tracking code -->"
                rows={4}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_heatmaps"
                  name="enable_heatmaps"
                  defaultChecked={domain.custom_branding?.analytics?.enable_heatmaps}
                />
                <Label htmlFor="enable_heatmaps">Enable Heatmaps</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_session_recording"
                  name="enable_session_recording"
                  defaultChecked={domain.custom_branding?.analytics?.enable_session_recording}
                />
                <Label htmlFor="enable_session_recording">Enable Session Recording</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
