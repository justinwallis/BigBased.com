"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GoogleDriveSyncProps {
  tenantId: string
}

export function GoogleDriveSync({ tenantId }: GoogleDriveSyncProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/sync-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      })

      if (response.ok) {
        setLastSync(new Date())
        toast({
          title: "Sync Complete",
          description: "Google Drive content has been successfully indexed.",
        })
      } else {
        throw new Error("Sync failed")
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync Google Drive content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>Google Drive Integration</CardTitle>
              <CardDescription>Sync content from your Google Drive folder</CardDescription>
            </div>
          </div>
          <Badge variant={lastSync ? "default" : "secondary"}>
            {lastSync ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
            {lastSync ? "Synced" : "Not Synced"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Folder:</strong> BigBased AI Content
            </p>
            {lastSync && (
              <p>
                <strong>Last Sync:</strong> {lastSync.toLocaleString()}
              </p>
            )}
          </div>

          <Button onClick={handleSync} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Google Drive
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            This will index all documents, text files, and Google Docs from your specified folder.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
