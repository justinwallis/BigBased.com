import { Key } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SecurityPage = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Manage your two-factor authentication settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Two-factor authentication is currently disabled.</p>
          <Button disabled>Enable Two-Factor Authentication</Button>
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
            <p className="text-sm text-gray-600">
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
