import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getMfaStatus } from "@/app/actions/mfa-actions"
import { getUserSessions } from "@/app/actions/session-actions"
import { SecurityDashboard } from "@/components/security-dashboard"
import { PasswordStrengthAnalyzer } from "@/components/password-strength-analyzer"
import { SecurityTimeline } from "@/components/security-timeline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Smartphone, Settings, Eye, Lock } from "lucide-react"
import Link from "next/link"

export default async function SecurityPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in?redirect=/profile/security")
  }

  // Get MFA status
  const mfaResult = await getMfaStatus()
  const mfaEnabled = mfaResult.success ? mfaResult.data.enabled : false

  // Get user sessions
  const sessionsResult = await getUserSessions()
  const sessions = sessionsResult.success ? sessionsResult.sessions : []

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account security and monitor activity</p>
        </div>
        <Link href="/profile">
          <Button variant="outline">Back to Profile</Button>
        </Link>
      </div>

      {/* Security Dashboard */}
      <SecurityDashboard user={user} sessions={sessions} mfaEnabled={mfaEnabled} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Password Analyzer */}
        <PasswordStrengthAnalyzer />

        {/* Security Timeline */}
        <SecurityTimeline />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Quick access to important security features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/profile/security/two-factor">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Auth</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{mfaEnabled ? "Enabled" : "Setup"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile/security/sessions">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sessions.length} devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile/security/change-password">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Update password</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile/security-log">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Security Log</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View activity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
