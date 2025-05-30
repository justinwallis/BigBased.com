"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Settings,
  Chrome,
  ChromeIcon as Firefox,
  AppleIcon as Safari,
  Monitor,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface NotificationDisableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDisable: () => Promise<void>
  isDisabling: boolean
}

export default function NotificationDisableDialog({
  open,
  onOpenChange,
  onConfirmDisable,
  isDisabling,
}: NotificationDisableDialogProps) {
  const [step, setStep] = useState<"confirm" | "instructions">("confirm")

  const handleDisable = async () => {
    await onConfirmDisable()
    setStep("instructions")
  }

  const getBrowserIcon = () => {
    if (typeof window === "undefined") return <Monitor className="h-5 w-5" />

    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.includes("chrome")) return <Chrome className="h-5 w-5 text-blue-500" />
    if (userAgent.includes("firefox")) return <Firefox className="h-5 w-5 text-orange-500" />
    if (userAgent.includes("safari")) return <Safari className="h-5 w-5 text-blue-600" />
    return <Monitor className="h-5 w-5" />
  }

  const getBrowserInstructions = () => {
    if (typeof window === "undefined") return "Check your browser's notification settings"

    const userAgent = window.navigator.userAgent.toLowerCase()

    if (userAgent.includes("chrome")) {
      return (
        <div className="space-y-2">
          <p className="font-medium flex items-center space-x-2">
            <Chrome className="h-4 w-4 text-blue-500" />
            <span>Chrome Instructions:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
            <li>Click the lock icon in the address bar</li>
            <li>Click "Notifications"</li>
            <li>Select "Block" or "Ask"</li>
            <li>Refresh the page</li>
          </ol>
        </div>
      )
    }

    if (userAgent.includes("firefox")) {
      return (
        <div className="space-y-2">
          <p className="font-medium flex items-center space-x-2">
            <Firefox className="h-4 w-4 text-orange-500" />
            <span>Firefox Instructions:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
            <li>Click the shield icon in the address bar</li>
            <li>Click "Permissions"</li>
            <li>Find "Notifications" and click "Block"</li>
            <li>Refresh the page</li>
          </ol>
        </div>
      )
    }

    if (userAgent.includes("safari")) {
      return (
        <div className="space-y-2">
          <p className="font-medium flex items-center space-x-2">
            <Safari className="h-4 w-4 text-blue-600" />
            <span>Safari Instructions:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
            <li>Go to Safari → Preferences</li>
            <li>Click "Websites" tab</li>
            <li>Select "Notifications" in the sidebar</li>
            <li>Find this site and select "Deny"</li>
          </ol>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <p className="font-medium">Browser Settings:</p>
        <p className="text-sm text-muted-foreground">
          Look for notification settings in your browser's site permissions or privacy settings.
        </p>
      </div>
    )
  }

  const handleClose = () => {
    setStep("confirm")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Disable Push Notifications</span>
              </DialogTitle>
              <DialogDescription>
                This will unsubscribe you from our notification service, but won't change your browser's permission
                settings.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What will happen:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-blue-700 dark:text-blue-300">
                      You'll stop receiving notifications from Big Based
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-blue-700 dark:text-blue-300">Your preferences will be cleared</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <XCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Browser permission will remain (requires manual change)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Settings className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">For complete blocking:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You'll need to manually change your browser settings after this step.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleDisable} disabled={isDisabling} className="w-full sm:w-auto">
                {isDisabling ? "Disabling..." : "Disable Notifications"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Notifications Disabled</span>
              </DialogTitle>
              <DialogDescription>
                You've been unsubscribed from our notifications. For complete blocking, follow these steps:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Step 1 Complete</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You've been unsubscribed from Big Based notifications.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Step 2
                  </Badge>
                  <span className="font-medium">Block in Browser Settings</span>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </div>

                {getBrowserInstructions()}
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> If you skip Step 2, you can always re-enable notifications later without
                  changing browser settings.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Got it, thanks!
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
