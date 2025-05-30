"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface NotificationDisableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDisable: () => void
  isDisabling: boolean
}

export default function NotificationDisableDialog({
  open,
  onOpenChange,
  onConfirmDisable,
  isDisabling,
}: NotificationDisableDialogProps) {
  const handleOkay = () => {
    onConfirmDisable()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Disable Push Notifications</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to disable push notifications? You'll no longer receive instant updates about:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1">
            <li>Security alerts and login notifications</li>
            <li>Important platform updates</li>
            <li>Community events and announcements</li>
            <li>New content and library updates</li>
          </ul>
          <p className="mt-3 text-xs">You can always re-enable notifications later in your profile settings.</p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-foreground">
            Cancel
          </Button>
          <Button onClick={handleOkay} variant="default">
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
