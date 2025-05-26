"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Trophy, BookOpen } from "lucide-react"

interface TheRealWorldPopupProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  profileName: string
}

export function TheRealWorldPopup({ isOpen, onClose, username, profileName }: TheRealWorldPopupProps) {
  if (!username) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            The Real World
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{profileName}</h3>
            <Badge variant="secondary" className="mt-1">
              @{username}
            </Badge>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 rounded-lg border">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-red-600" />
                <span className="font-medium">Member of The Real World</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-orange-600" />
                <span>Elite entrepreneurship community</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span>Building wealth and success</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <p>The Real World is an exclusive community focused on</p>
            <p>entrepreneurship, wealth building, and personal development.</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <ExternalLink className="h-3 w-3" />
            <span>No direct profile linking available</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
