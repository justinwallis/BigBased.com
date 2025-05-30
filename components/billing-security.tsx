"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Shield, Bell, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillingSecurityProps {
  settings: {
    requirePasswordForChanges: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    expirationWarnings: boolean
  }
  onUpdate: (settings: any) => Promise<void>
}

export function BillingSecurity({ settings, onUpdate }: BillingSecurityProps) {
  const { toast } = useToast()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)

    try {
      await onUpdate(newSettings)
      toast({
        title: "Settings updated",
        description: "Your billing security settings have been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
      // Revert on error
      setLocalSettings(localSettings)
    }
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <Shield className="h-5 w-5" />
          <span>Security & Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium dark:text-white">Require Password for Changes</span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Require your password when adding or removing payment methods
            </p>
          </div>
          <Switch
            checked={localSettings.requirePasswordForChanges}
            onCheckedChange={(checked) => handleToggle("requirePasswordForChanges", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-green-500" />
              <span className="font-medium dark:text-white">Email Notifications</span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Get notified about payment method changes and transactions
            </p>
          </div>
          <Switch
            checked={localSettings.emailNotifications}
            onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="font-medium dark:text-white">Expiration Warnings</span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Get notified 30 days before your payment methods expire
            </p>
          </div>
          <Switch
            checked={localSettings.expirationWarnings}
            onCheckedChange={(checked) => handleToggle("expirationWarnings", checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
