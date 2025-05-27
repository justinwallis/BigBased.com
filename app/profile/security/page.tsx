import { Key, Shield } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SecurityPage = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Two-factor authentication helps protect your account by requiring a second form of verification when
              signing in.
            </p>
            <Link href="/profile/security/two-factor">
              <Button>Manage Two-Factor Authentication</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For security reasons, changing your password requires verification of your current password.
            </p>
            <Link href="/profile/security/change-password">
              <Button>Change Password</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SecurityPage
