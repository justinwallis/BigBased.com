"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Mail, Calendar, MoreHorizontal, Shield, UserX, RefreshCw, XCircle, Trash2, AlertTriangle } from "lucide-react"
import {
  deleteOrphanedProfile,
  updateUserRole,
  deleteUserCompletely,
  resetUserPassword,
  cleanupOrphanedProfiles,
  type UserProfile,
} from "@/app/actions/user-management-actions"
import { useRouter } from "next/navigation"

interface UserManagementClientProps {
  initialUsers: UserProfile[]
}

export default function UserManagementClient({ initialUsers }: UserManagementClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    user?: UserProfile
    type?: "profile" | "complete"
  }>({
    open: false,
  })
  const { toast } = useToast()
  const router = useRouter()

  const refreshUsers = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  const handleDeleteOrphanedProfile = async (user: UserProfile) => {
    setLoading(true)
    try {
      console.log("Deleting orphaned profile:", user.id, user.username)
      const result = await deleteOrphanedProfile(user.id)
      if (result.success) {
        toast({
          title: "Profile deleted",
          description: `Orphaned profile for ${user.username} has been deleted.`,
        })
        // Remove from local state immediately
        setUsers(users.filter((u) => u.id !== user.id))
        // Also refresh the page data
        refreshUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setDeleteDialog({ open: false })
    }
  }

  const handleDeleteUserCompletely = async (user: UserProfile) => {
    setLoading(true)
    try {
      const result = await deleteUserCompletely(user.id)
      if (result.success) {
        toast({
          title: "User deleted",
          description: `User ${user.username} has been completely deleted.`,
        })
        setUsers(users.filter((u) => u.id !== user.id))
        refreshUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user",
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
      setDeleteDialog({ open: false })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: "admin" | "user") => {
    setLoading(true)
    try {
      const result = await updateUserRole(userId, newRole)
      if (result.success) {
        toast({
          title: "Role updated",
          description: `User role has been updated to ${newRole}.`,
        })
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
        refreshUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update role",
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

  const handleResetPassword = async (userId: string) => {
    setLoading(true)
    try {
      const result = await resetUserPassword(userId)
      if (result.success) {
        toast({
          title: "Password reset",
          description: "User password has been reset. They will need to sign in with the new password.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reset password",
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

  const handleCleanupOrphaned = async () => {
    setLoading(true)
    try {
      const result = await cleanupOrphanedProfiles()
      if (result.success) {
        toast({
          title: "Cleanup complete",
          description: `Deleted ${result.deletedCount} orphaned profiles.`,
        })
        // Refresh the entire page to get updated data
        refreshUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to cleanup profiles",
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

  const orphanedUsers = users.filter((user) => !user.auth_exists)
  const isLoading = loading || isPending

  return (
    <div className="space-y-4">
      {orphanedUsers.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Orphaned Profiles Found</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {orphanedUsers.length} profile(s) exist without corresponding auth users
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleCleanupOrphaned} disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? "Cleaning..." : "Cleanup All"}
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Email</TableHead>
            <TableHead className="text-foreground">Username</TableHead>
            <TableHead className="text-foreground">Role</TableHead>
            <TableHead className="text-foreground">Auth Status</TableHead>
            <TableHead className="text-foreground">Created</TableHead>
            <TableHead className="text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isAdmin = user.role === "admin" || user.email === process.env.ADMIN_EMAIL
            const isOrphaned = !user.auth_exists

            return (
              <TableRow
                key={user.id}
                className={isOrphaned ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : ""}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                    {isOrphaned && (
                      <Badge variant="outline" className="text-xs">
                        Orphaned
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{user.username}</TableCell>
                <TableCell>
                  <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "User"}</Badge>
                </TableCell>
                <TableCell>
                  {isOrphaned ? (
                    <Badge variant="destructive">No Auth</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>

                      {!isOrphaned && (
                        <>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {isAdmin ? (
                            <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "user")}>
                              <UserX className="h-4 w-4 mr-2" />
                              Remove Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "admin")}>
                              <Shield className="h-4 w-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {isOrphaned ? (
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, user, type: "profile" })}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Profile
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, user, type: "complete" })}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteDialog.type === "profile" ? "Delete Orphaned Profile" : "Delete User Completely"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === "profile" ? (
                <>
                  This will delete the profile for <strong>{deleteDialog.user?.username}</strong> since their auth
                  account no longer exists. This action cannot be undone.
                </>
              ) : (
                <>
                  This will permanently delete <strong>{deleteDialog.user?.username}</strong> and all their data. This
                  action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog.user) {
                  if (deleteDialog.type === "profile") {
                    handleDeleteOrphanedProfile(deleteDialog.user)
                  } else {
                    handleDeleteUserCompletely(deleteDialog.user)
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
