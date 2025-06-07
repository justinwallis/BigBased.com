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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Calendar,
  MoreHorizontal,
  Shield,
  UserX,
  RefreshCw,
  XCircle,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import {
  deleteOrphanedProfile,
  updateUserRole,
  deleteUserCompletely,
  resetUserPassword,
  cleanupOrphanedProfiles,
  restoreUserAccount,
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
  const [restoreDialog, setRestoreDialog] = useState<{
    open: boolean
    user?: UserProfile
    email: string
    password: string
  }>({
    open: false,
    email: "",
    password: "",
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
          title: "User auth deleted",
          description: `Auth for ${user.username} has been deleted. Profile kept as orphaned.`,
        })
        // Update the user's auth status in the local state
        setUsers(users.map((u) => (u.id === user.id ? { ...u, auth_exists: false } : u)))
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

  const handleRestoreAccount = async (user: UserProfile) => {
    setLoading(true)
    try {
      const result = await restoreUserAccount(user.id, restoreDialog.email, restoreDialog.password || undefined)

      if (result.success) {
        toast({
          title: "Account restored",
          description: result.error || `Account for ${user.username} has been restored.`,
        })
        // Update the user's auth status in the local state
        setUsers(users.map((u) => (u.id === user.id ? { ...u, auth_exists: true, email: restoreDialog.email } : u)))
        refreshUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to restore account",
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
      setRestoreDialog({ open: false, email: "", password: "" })
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

  const openRestoreDialog = (user: UserProfile) => {
    setRestoreDialog({
      open: true,
      user,
      email: user.last_known_email || user.email || `${user.username}@example.com`,
      password: "",
    })
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCleanupOrphaned} disabled={isLoading}>
                <Trash2 className="h-4 w-4 mr-2" />
                {isLoading ? "Cleaning..." : "Delete All"}
              </Button>
            </div>
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
                    {isOrphaned && user.last_known_email && (
                      <Badge variant="outline" className="text-xs">
                        Last known
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

                      {isOrphaned ? (
                        <>
                          <DropdownMenuItem onClick={() => openRestoreDialog(user)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore Account
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog({ open: true, user, type: "profile" })}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Profile
                          </DropdownMenuItem>
                        </>
                      ) : (
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
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog({ open: true, user, type: "complete" })}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete Auth
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteDialog.type === "profile" ? "Delete Orphaned Profile" : "Delete User Auth"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === "profile" ? (
                <>
                  This will delete the profile for <strong>{deleteDialog.user?.username}</strong> since their auth
                  account no longer exists. This action cannot be undone.
                </>
              ) : (
                <>
                  This will delete the auth account for <strong>{deleteDialog.user?.username}</strong> but keep their
                  profile as orphaned for possible restoration. The user will no longer be able to log in.
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

      {/* Restore Account Dialog */}
      <Dialog
        open={restoreDialog.open}
        onOpenChange={(open) => !isLoading && setRestoreDialog({ ...restoreDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore User Account</DialogTitle>
            <DialogDescription>
              Restore access for <strong>{restoreDialog.user?.username}</strong> by creating a new auth account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={restoreDialog.email}
                onChange={(e) => setRestoreDialog({ ...restoreDialog, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={restoreDialog.password}
                onChange={(e) => setRestoreDialog({ ...restoreDialog, password: e.target.value })}
                placeholder="Leave blank for auto-generated password"
              />
              <p className="text-xs text-muted-foreground">
                If left blank, a secure temporary password will be generated.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestoreDialog({ ...restoreDialog, open: false })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => restoreDialog.user && handleRestoreAccount(restoreDialog.user)}
              disabled={isLoading || !restoreDialog.email}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Restoring..." : "Restore Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
