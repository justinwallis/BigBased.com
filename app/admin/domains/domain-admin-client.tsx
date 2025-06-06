"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  addDomain,
  bulkAddDomains,
  toggleDomainStatus,
  updateDomainBranding,
  updateDomainOwner,
  deleteDomain,
} from "@/app/actions/domain-actions"
import type { CustomBranding } from "@/lib/domain-config"
import { toast } from "@/components/ui/use-toast"

interface Domain {
  id: number
  domain: string
  site_type: "bigbased" | "basedbook" | "custom"
  is_active: boolean
  custom_branding: CustomBranding
  owner_user_id?: string
  owner_email?: string
  owner_name?: string
  notes?: string
  tags?: string[]
  created_at: string
}

export default function DomainAdminClient({ initialDomains }: { initialDomains: Domain[] }) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [newDomain, setNewDomain] = useState("")
  const [newDomainType, setNewDomainType] = useState<"bigbased" | "basedbook" | "custom">("bigbased")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [bulkDomains, setBulkDomains] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Add a single domain
  const handleAddDomain = async () => {
    if (!newDomain) return

    setIsLoading(true)
    const result = await addDomain(newDomain, newDomainType, ownerEmail, ownerName)
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Domain added",
        description: `${newDomain} has been added successfully.`,
      })
      setDomains([result.data, ...domains])
      setNewDomain("")
      setOwnerEmail("")
      setOwnerName("")
    } else {
      toast({
        title: "Error adding domain",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Bulk add domains
  const handleBulkAddDomains = async () => {
    if (!bulkDomains) return

    const domainList = bulkDomains
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
      .map((domain) => ({ domain, siteType: newDomainType }))

    setIsLoading(true)
    const result = await bulkAddDomains(domainList)
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Domains added",
        description: `${result.count} domains have been added successfully.`,
      })
      setDomains([...result.data, ...domains])
      setBulkDomains("")
    } else {
      toast({
        title: "Error adding domains",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Toggle domain status
  const handleToggleStatus = async (domain: Domain) => {
    const result = await toggleDomainStatus(domain.id, !domain.is_active)

    if (result.success) {
      toast({
        title: `Domain ${!domain.is_active ? "activated" : "deactivated"}`,
        description: `${domain.domain} has been ${!domain.is_active ? "activated" : "deactivated"}.`,
      })

      setDomains(domains.map((d) => (d.id === domain.id ? { ...d, is_active: !d.is_active } : d)))
    } else {
      toast({
        title: "Error updating domain",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Update domain branding
  const handleUpdateBranding = async (domain: Domain, branding: CustomBranding) => {
    const result = await updateDomainBranding(domain.id, branding)

    if (result.success) {
      toast({
        title: "Branding updated",
        description: `Branding for ${domain.domain} has been updated.`,
      })

      setDomains(domains.map((d) => (d.id === domain.id ? { ...d, custom_branding: branding } : d)))
      setSelectedDomain(null)
    } else {
      toast({
        title: "Error updating branding",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Update domain owner
  const handleUpdateOwner = async (domain: Domain, ownerData: any) => {
    const result = await updateDomainOwner(domain.id, ownerData)

    if (result.success) {
      toast({
        title: "Owner updated",
        description: `Owner information for ${domain.domain} has been updated.`,
      })

      setDomains(domains.map((d) => (d.id === domain.id ? { ...d, ...ownerData } : d)))
      setSelectedDomain(null)
    } else {
      toast({
        title: "Error updating owner",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Delete domain
  const handleDeleteDomain = async (domain: Domain) => {
    if (!confirm(`Are you sure you want to delete ${domain.domain}? This action cannot be undone.`)) {
      return
    }

    const result = await deleteDomain(domain.id)

    if (result.success) {
      toast({
        title: "Domain deleted",
        description: `${domain.domain} has been deleted.`,
      })

      setDomains(domains.filter((d) => d.id !== domain.id))
    } else {
      toast({
        title: "Error deleting domain",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  // Filter domains by search term
  const filteredDomains = domains.filter(
    (domain) =>
      domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.owner_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-8">
      <Tabs defaultValue="domains">
        <TabsList className="mb-4">
          <TabsTrigger value="domains">Domains ({domains.length})</TabsTrigger>
          <TabsTrigger value="add">Add Domain</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>Domain Management</CardTitle>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select
                  value="all"
                  onValueChange={(value) => {
                    if (value === "active") setSearchTerm("active:true")
                    else if (value === "inactive") setSearchTerm("active:false")
                    else setSearchTerm("")
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDomains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">{domain.domain}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            domain.site_type === "bigbased"
                              ? "default"
                              : domain.site_type === "basedbook"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {domain.site_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={domain.is_active} onCheckedChange={() => handleToggleStatus(domain)} />
                          <span>{domain.is_active ? "Active" : "Inactive"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{domain.owner_name || domain.owner_email || "—"}</TableCell>
                      <TableCell>{new Date(domain.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedDomain(domain)}>
                                Edit
                              </Button>
                            </DialogTrigger>
                            {selectedDomain && selectedDomain.id === domain.id && (
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Domain: {domain.domain}</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="branding">
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="branding">Branding</TabsTrigger>
                                    <TabsTrigger value="owner">Owner Info</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="branding">
                                    <div className="grid gap-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="siteName">Site Name</Label>
                                          <Input
                                            id="siteName"
                                            defaultValue={domain.custom_branding?.siteName || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain }
                                              if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                              updatedDomain.custom_branding.siteName = e.target.value
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="tagline">Tagline</Label>
                                          <Input
                                            id="tagline"
                                            defaultValue={domain.custom_branding?.tagline || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain }
                                              if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                              updatedDomain.custom_branding.tagline = e.target.value
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="logo">Logo URL</Label>
                                          <Input
                                            id="logo"
                                            defaultValue={domain.custom_branding?.logo || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain }
                                              if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                              updatedDomain.custom_branding.logo = e.target.value
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="favicon">Favicon URL</Label>
                                          <Input
                                            id="favicon"
                                            defaultValue={domain.custom_branding?.favicon || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain }
                                              if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                              updatedDomain.custom_branding.favicon = e.target.value
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="primaryColor">Primary Color</Label>
                                          <div className="flex space-x-2">
                                            <Input
                                              id="primaryColor"
                                              type="color"
                                              className="w-12 p-1 h-10"
                                              defaultValue={domain.custom_branding?.colors?.primary || "#1f2937"}
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.primary = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                            <Input
                                              value={
                                                selectedDomain?.custom_branding?.colors?.primary ||
                                                domain.custom_branding?.colors?.primary ||
                                                "#1f2937"
                                              }
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.primary = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                                          <div className="flex space-x-2">
                                            <Input
                                              id="secondaryColor"
                                              type="color"
                                              className="w-12 p-1 h-10"
                                              defaultValue={domain.custom_branding?.colors?.secondary || "#3b82f6"}
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.secondary = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                            <Input
                                              value={
                                                selectedDomain?.custom_branding?.colors?.secondary ||
                                                domain.custom_branding?.colors?.secondary ||
                                                "#3b82f6"
                                              }
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.secondary = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="accentColor">Accent Color</Label>
                                          <div className="flex space-x-2">
                                            <Input
                                              id="accentColor"
                                              type="color"
                                              className="w-12 p-1 h-10"
                                              defaultValue={domain.custom_branding?.colors?.accent || "#ef4444"}
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.accent = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                            <Input
                                              value={
                                                selectedDomain?.custom_branding?.colors?.accent ||
                                                domain.custom_branding?.colors?.accent ||
                                                "#ef4444"
                                              }
                                              onChange={(e) => {
                                                const updatedDomain = { ...selectedDomain }
                                                if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                                if (!updatedDomain.custom_branding.colors)
                                                  updatedDomain.custom_branding.colors = {}
                                                updatedDomain.custom_branding.colors.accent = e.target.value
                                                setSelectedDomain(updatedDomain)
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="metaTitle">Meta Title</Label>
                                        <Input
                                          id="metaTitle"
                                          defaultValue={domain.custom_branding?.metaTags?.title || ""}
                                          onChange={(e) => {
                                            const updatedDomain = { ...selectedDomain }
                                            if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                            if (!updatedDomain.custom_branding.metaTags)
                                              updatedDomain.custom_branding.metaTags = {}
                                            updatedDomain.custom_branding.metaTags.title = e.target.value
                                            setSelectedDomain(updatedDomain)
                                          }}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="metaDescription">Meta Description</Label>
                                        <Textarea
                                          id="metaDescription"
                                          defaultValue={domain.custom_branding?.metaTags?.description || ""}
                                          onChange={(e) => {
                                            const updatedDomain = { ...selectedDomain }
                                            if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                            if (!updatedDomain.custom_branding.metaTags)
                                              updatedDomain.custom_branding.metaTags = {}
                                            updatedDomain.custom_branding.metaTags.description = e.target.value
                                            setSelectedDomain(updatedDomain)
                                          }}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="ogImage">OG Image URL</Label>
                                        <Input
                                          id="ogImage"
                                          defaultValue={domain.custom_branding?.metaTags?.ogImage || ""}
                                          onChange={(e) => {
                                            const updatedDomain = { ...selectedDomain }
                                            if (!updatedDomain.custom_branding) updatedDomain.custom_branding = {}
                                            if (!updatedDomain.custom_branding.metaTags)
                                              updatedDomain.custom_branding.metaTags = {}
                                            updatedDomain.custom_branding.metaTags.ogImage = e.target.value
                                            setSelectedDomain(updatedDomain)
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter className="mt-4">
                                      <Button
                                        onClick={() =>
                                          handleUpdateBranding(domain, selectedDomain?.custom_branding || {})
                                        }
                                      >
                                        Save Branding
                                      </Button>
                                    </DialogFooter>
                                  </TabsContent>

                                  <TabsContent value="owner">
                                    <div className="grid gap-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="ownerName">Owner Name</Label>
                                          <Input
                                            id="ownerName"
                                            defaultValue={domain.owner_name || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain, owner_name: e.target.value }
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="ownerEmail">Owner Email</Label>
                                          <Input
                                            id="ownerEmail"
                                            defaultValue={domain.owner_email || ""}
                                            onChange={(e) => {
                                              const updatedDomain = { ...selectedDomain, owner_email: e.target.value }
                                              setSelectedDomain(updatedDomain)
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                          id="notes"
                                          defaultValue={domain.notes || ""}
                                          onChange={(e) => {
                                            const updatedDomain = { ...selectedDomain, notes: e.target.value }
                                            setSelectedDomain(updatedDomain)
                                          }}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="tags">Tags (comma separated)</Label>
                                        <Input
                                          id="tags"
                                          defaultValue={domain.tags?.join(", ") || ""}
                                          onChange={(e) => {
                                            const tags = e.target.value
                                              .split(",")
                                              .map((tag) => tag.trim())
                                              .filter((tag) => tag)
                                            const updatedDomain = { ...selectedDomain, tags }
                                            setSelectedDomain(updatedDomain)
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter className="mt-4">
                                      <Button
                                        onClick={() =>
                                          handleUpdateOwner(domain, {
                                            ownerName: selectedDomain?.owner_name,
                                            ownerEmail: selectedDomain?.owner_email,
                                            notes: selectedDomain?.notes,
                                            tags: selectedDomain?.tags,
                                          })
                                        }
                                      >
                                        Save Owner Info
                                      </Button>
                                    </DialogFooter>
                                  </TabsContent>

                                  <TabsContent value="analytics">
                                    <div className="text-center py-8">
                                      <p className="text-muted-foreground">
                                        Analytics dashboard coming soon. Check back later!
                                      </p>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            )}
                          </Dialog>

                          <Button variant="destructive" size="sm" onClick={() => handleDeleteDomain(domain)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domainType">Domain Type</Label>
                    <Select
                      value={newDomainType}
                      onValueChange={(value: "bigbased" | "basedbook" | "custom") => setNewDomainType(value)}
                    >
                      <SelectTrigger id="domainType">
                        <SelectValue placeholder="Select domain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bigbased">Big Based</SelectItem>
                        <SelectItem value="basedbook">BasedBook</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name (Optional)</Label>
                    <Input
                      id="ownerName"
                      placeholder="John Doe"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email (Optional)</Label>
                    <Input
                      id="ownerEmail"
                      placeholder="john@example.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleAddDomain} disabled={!newDomain || isLoading} className="w-full">
                  {isLoading ? "Adding..." : "Add Domain"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkDomains">Domain Names (One per line)</Label>
                  <Textarea
                    id="bulkDomains"
                    placeholder="example1.com
example2.com
example3.com"
                    value={bulkDomains}
                    onChange={(e) => setBulkDomains(e.target.value)}
                    rows={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkDomainType">Domain Type</Label>
                  <Select
                    value={newDomainType}
                    onValueChange={(value: "bigbased" | "basedbook" | "custom") => setNewDomainType(value)}
                  >
                    <SelectTrigger id="bulkDomainType">
                      <SelectValue placeholder="Select domain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bigbased">Big Based</SelectItem>
                      <SelectItem value="basedbook">BasedBook</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleBulkAddDomains} disabled={!bulkDomains || isLoading} className="w-full">
                  {isLoading ? "Adding..." : "Add Domains"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
