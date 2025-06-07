import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Shield,
  UserCheck,
  Clock,
  Mail,
  Calendar,
  UserX,
  UserPlus,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
  Unlock,
  ArrowLeft,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = "force-dynamic"

async function getUsersData() {
  try {
    // Use admin client for user operations
    const adminClient = createAdminClient()
    const regularClient = createClient()

    // Get all users using admin client
    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers()

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return { users: [], profiles: [], sessions: [], adminLogs: [] }
    }

    // Get profiles using regular client
    const { data: profiles, error: profilesError } = await regularClient.from("profiles").select("*")

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    }

    // Get active sessions
    const { data: sessions, error: sessionsError } = await regularClient
      .from("auth_logs")
      .select("user_id, created_at")
      .eq("event", "login_success")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError)
    }

    // Get admin action logs
    const { data: adminLogs, error: adminLogsError } = await regularClient
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .catch(() => ({ data: null, error: new Error("Table might not exist") }))

    if (adminLogsError) {
      console.error("Error fetching admin logs:", adminLogsError)
    }

    return {
      users: usersData?.users || [],
      profiles: profiles || [],
      sessions: sessions || [],
      adminLogs: adminLogs || [],
    }
  } catch (error) {
    console.error("Error in getUsersData:", error)
    return { users: [], profiles: [], sessions: [], adminLogs: [] }
  }
}

export default async function UsersPage() {
  const { users, profiles, sessions, adminLogs } = await getUsersData()

  // Calculate metrics
  const totalUsers = users.length
  const adminUsers = users.filter(
    (user) =>
      user.app_metadata?.role === "admin" ||
      user.email === process.env.ADMIN_EMAIL ||
      user.user_metadata?.role === "admin",
  ).length

  const activeSessions = new Set(sessions.map((s) => s.user_id)).size
  const recentUsers = users.filter(
    (user) => new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  // Sample recent admin actions if the table doesn't exist yet
  const sampleAdminActions = [
    {
      id: 1,
      action: "promote_admin",
      target_user: "user2@example.com",
      admin_user: process.env.ADMIN_EMAIL,
      created_at: new Date().toISOString(),
      status: "success",
    },
    {
      id: 2,
      action: "reset_password",
      target_user: "user1@example.com",
      admin_user: process.env.ADMIN_EMAIL,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
  ]

  const recentActions = adminLogs.length > 0 ? adminLogs : sampleAdminActions

  // Action icon mapping
  const actionIcons = {
    promote_admin: <Shield className="h-4 w-4" />,
    demote_admin: <UserX className="h-4 w-4" />,
    reset_password: <RefreshCw className="h-4 w-4" />,
    suspend_user: <Lock className="h-4 w-4" />,
    unsuspend_user: <Unlock className="h-4 w-4" />,
    delete_user: <XCircle className="h-4 w-4" />,
    create_user: <UserPlus className="h-4 w-4" />,
    verify_email: <CheckCircle className="h-4 w-4" />,
    default: <AlertTriangle className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {recentUsers > 0 ? `+${recentUsers} this week` : "No new users this week"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">{adminUsers === 1 ? "You" : `Including you`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentUsers}</div>
            <p className="text-xs text-muted-foreground">Recent signups</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="actions">Recent Actions</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of registered users</CardDescription>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const profile = profiles.find((p) => p.id === user.id)
                    const isAdmin =
                      user.app_metadata?.role === "admin" ||
                      user.email === process.env.ADMIN_EMAIL ||
                      user.user_metadata?.role === "admin"
                    const isSuspended = user.banned_until && new Date(user.banned_until) > new Date()

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>{profile?.username || "Not set"}</TableCell>
                        <TableCell>
                          <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "User"}</Badge>
                        </TableCell>
                        <TableCell>
                          {isSuspended ? (
                            <Badge variant="destructive">Suspended</Badge>
                          ) : (
                            <Badge
                              variant={user.email_confirmed_at ? "default" : "destructive"}
                              className={user.email_confirmed_at ? "bg-green-500" : ""}
                            >
                              {user.email_confirmed_at ? "Verified" : "Unverified"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {isAdmin ? (
                                <DropdownMenuItem>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {isSuspended ? (
                                <DropdownMenuItem>
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Unsuspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Administrative Actions</CardTitle>
              <CardDescription>Log of recent actions taken by administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actionIcons[action.action] || actionIcons.default}
                          {action.action.replace("_", " ")}
                        </div>
                      </TableCell>
                      <TableCell>{action.target_user}</TableCell>
                      <TableCell>{action.admin_user}</TableCell>
                      <TableCell>{new Date(action.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={action.status === "success" ? "default" : "destructive"}
                          className={action.status === "success" ? "bg-green-500" : ""}
                        >
                          {action.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk User Operations</CardTitle>
              <CardDescription>Perform actions on multiple users at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Welcome Email
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend Verification Emails
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Password Reset
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Suspend Inactive Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Update Role Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Delete Unverified Users
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
