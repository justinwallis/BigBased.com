"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ExternalLink, Search, Filter } from "lucide-react"
import { type CMSRedirect, deleteRedirect } from "@/app/actions/cms-redirects-actions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface RedirectsListClientProps {
  redirects: CMSRedirect[]
}

export function RedirectsListClient({ redirects }: RedirectsListClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const { toast } = useToast()

  const filteredRedirects = redirects.filter((redirect) => {
    const matchesSearch =
      redirect.source_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redirect.destination_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redirect.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && redirect.is_active) ||
      (statusFilter === "inactive" && !redirect.is_active)

    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return

    const result = await deleteRedirect(id)
    if (result.success) {
      toast({
        title: "Success",
        description: "Redirect deleted successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete redirect",
        variant: "destructive",
      })
    }
  }

  const getRedirectTypeLabel = (type: number) => {
    switch (type) {
      case 301:
        return "301 Permanent"
      case 302:
        return "302 Temporary"
      case 307:
        return "307 Temporary"
      case 308:
        return "308 Permanent"
      default:
        return `${type}`
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search redirects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active" : "Inactive"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active Only</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive Only</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Redirects Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source Path</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hits</TableHead>
              <TableHead>Last Hit</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRedirects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm || statusFilter !== "all" ? "No redirects match your filters" : "No redirects found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredRedirects.map((redirect) => (
                <TableRow key={redirect.id}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {redirect.source_path}
                      {redirect.is_regex && <Badge variant="secondary">Regex</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-[300px] truncate">
                    {redirect.destination_path}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRedirectTypeLabel(redirect.redirect_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={redirect.is_active ? "default" : "secondary"}>
                      {redirect.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{redirect.hit_count.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {redirect.last_hit_at ? new Date(redirect.last_hit_at).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/cms/redirects/${redirect.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={redirect.source_path} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Test
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(redirect.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
