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
  Bug,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
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
    const supabase = createClient()
    console.log("=== Starting getUsersData ===")

    // Step 1: Get profiles data (safely)
    let profiles = []
    let profilesError = null

    try {
      const profilesResult = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      profiles = profilesResult.data || []
      profilesError = profilesResult.error
      console.log("Profiles fetched:", { count: profiles.length, error: profilesError })
    } catch (error) {
      console.error("Error fetching profiles:", error)
      profilesError = error
    }

    // Step 2: Get auth logs data (safely)
    let authLogs = []
    let authLogsError = null

    try {
      const authLogsResult = await supabase.from("auth_logs").select("*").limit(10)

      authLogs = authLogsResult.data || []
      authLogsError = authLogsResult.error
      console.log("Auth logs fetched:", { count: authLogs.length, error: authLogsError })
    } catch (error) {
      console.error("Error fetching auth logs:", error)
      authLogsError = error
    }

    // Step 3: Get admin logs data (safely)
    let adminLogs = []
    let adminLogsError = null

    try {
      const adminLogsResult = await supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      adminLogs = adminLogsResult.data || []
      adminLogsError = adminLogsResult.error
      console.log("Admin logs fetched:", { count: adminLogs.length, error: adminLogsError })
    } catch (error) {
      console.error("Error fetching admin logs:", error)
      adminLogsError = error
    }

    // Step 4: Try to get actual auth users count
    let authUsersCount = 2 // We know this from your query
    try {
      const { count } = await supabase.from("auth.users").select("*", { count: "exact", head: true })

      if (count !== null) {
        authUsersCount = count
      }
      console.log("Auth users count:", authUsersCount)
    } catch (error) {
      console.error("Cannot access auth.users directly:", error)
    }

    // Step 5: Create users array from available data
    let users = []

    if (profiles.length > 0) {
      // Use actual profiles data
      users = profiles.map((profile, index) => ({
        id: profile.id || `user-${index}`,
        email: profile.email || `${profile.username || "user"}@example.com`,
        created_at: profile.created_at || new Date().toISOString(),
        last_sign_in_at: profile.updated_at || profile.last_sign_in || null,
        app_metadata: { role: profile.role || "user" },
        user_metadata: {
          username: profile.username || `user${index + 1}`,
          full_name: profile.full_name || profile.display_name,
        },
        email_confirmed_at: profile.email_confirmed_at || profile.created_at,
        banned_until: null,
        profile: profile, // Keep original profile data
      }))
    } else {
      // Create placeholder users based on known count
      for (let i = 0; i < authUsersCount; i++) {
        users.push({
          id: `user-${i + 1}`,
          email: i === 0 ? process.env.ADMIN_EMAIL || "admin@example.com" : `user${i + 1}@example.com`,
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { role: i === 0 ? "admin" : "user" },
          user_metadata: { username: i === 0 ? "admin" : `user${i + 1}` },
          email_confirmed_at: new Date().toISOString(),
          banned_until: null,
          profile: null,
        })
      }
    }

    console.log("Final users array:", { count: users.length, users: users.map((u) => ({ id: u.id, email: u.email })) })

    return {
      users,
      profiles,
      sessions: authLogs,
      adminLogs,
      errors: {
        profilesError,
        authLogsError,
        adminLogsError,
      },
      debug: {
        profilesCount: profiles.length,
        authLogsCount: authLogs.length,
        adminLogsCount: adminLogs.length,
        authUsersCount,
      },
    }
  } catch (error) {
    console.error("Critical error in getUsersData:", error)

    // Return minimal fallback data
    return {
      users: [
        {
          id: "admin-1",
          email: process.env.ADMIN_EMAIL || "admin@example.com",
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { role: "admin" },
          user_metadata: { username: "admin" },
          email_confirmed_at: new Date().toISOString(),
          banned_until: null,
          profile: null,
        },
        {
          id: "user-1",
          email: "user@example.com",
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { role: "user" },
          user_metadata: { username: "user" },
          email_confirmed_at: new Date().toISOString(),
          banned_until: null,
          profile: null,
        },
      ],
      profiles: [],
      sessions: [],
      adminLogs: [],
      errors: {
        critical: error.message,
      },
      debug: {
        profilesCount: 0,
        authLogsCount: 0,
        adminLogsCount: 0,
        authUsersCount: 2,
      },
    }
  }
}

export default async function UsersPage() {
  const { users, profiles, sessions, adminLogs, errors, debug } = await getUsersData()

  // Calculate metrics
  const totalUsers = users.length
  const adminUsers = users.filter(
    (user) =>
      user.app_metadata?.role === "admin" ||
      user.email === process.env.ADMIN_EMAIL ||
      user.user_metadata?.role === "admin",
  ).length

  const activeSessions = sessions.length
  const recentUsers = users.filter(
    (user) => new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  // Sample recent admin actions
  const sampleAdminActions = [
    {
      id: 1,
      action: "user_login",
      target_user: process.env.ADMIN_EMAIL || "admin@example.com",
      admin_user: "System",
      created_at: new Date().toISOString(),
      status: "success",
    },
    {
      id: 2,
      action: "domain_added",
      target_user: "System",
      admin_user: process.env.ADMIN_EMAIL || "admin@example.com",
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
    user_login: <UserCheck className="h-4 w-4" />,
    domain_added: <CheckCircle className="h-4 w-4" />,
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/api/debug/users-data" target="_blank">
            <Bug className="h-4 w-4 mr-2" />
            Debug Data
          </Link>
        </Button>
      </div>

      {/* Debug Info Card */}
      {(errors.profilesError || errors.authLogsError || errors.critical) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2">
              <div>
                Profiles: {debug.profilesCount} records{" "}
                {errors.profilesError && `(Error: ${errors.profilesError.message})`}
              </div>
              <div>
                Auth Logs: {debug.authLogsCount} records{" "}
                {errors.authLogsError && `(Error: ${errors.authLogsError.message})`}
              </div>
              <div>
                Admin Logs: {debug.adminLogsCount} records{" "}
                {errors.adminLogsError && `(Error: ${errors.adminLogsError.message})`}
              </div>
              <div>Known Auth Users: {debug.authUsersCount}</div>
              {errors.critical && <div className="text-red-600">Critical Error: {errors.critical}</div>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {profiles.length > 0 ? `${profiles.length} profiles found` : "Using fallback data"}
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
            <p className="text-xs text-muted-foreground">From auth logs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Source</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length > 0 ? "✓" : "⚠"}</div>
            <p className="text-xs text-muted-foreground">{profiles.length > 0 ? "Live data" : "Fallback data"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="actions">Recent Actions</TabsTrigger>
          <TabsTrigger value="debug">Debug Info</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {profiles.length > 0
                    ? `Showing ${totalUsers} users from profiles table`
                    : `Showing ${totalUsers} users (fallback data - check debug tab)`}
                </CardDescription>
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
                            {!user.profile && (
                              <Badge variant="outline" className="text-xs">
                                Fallback
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.user_metadata?.username || "Not set"}</TableCell>
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

        <TabsContent value="debug" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>Technical details about data fetching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Data Sources:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      Profiles table: {debug.profilesCount} records{" "}
                      {errors.profilesError && `❌ ${errors.profilesError.message}`}
                    </li>
                    <li>
                      Auth logs table: {debug.authLogsCount} records{" "}
                      {errors.authLogsError && `❌ ${errors.authLogsError.message}`}
                    </li>
                    <li>
                      Admin logs table: {debug.adminLogsCount} records{" "}
                      {errors.adminLogsError && `❌ ${errors.adminLogsError.message}`}
                    </li>
                    <li>Known auth users: {debug.authUsersCount}</li>
                  </ul>
                </div>

                {errors.critical && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <h4 className="font-semibold text-red-800">Critical Error:</h4>
                    <p className="text-red-700">{errors.critical}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold">Raw Data Preview:</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify({ profiles: profiles.slice(0, 2), sessions: sessions.slice(0, 2) }, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
