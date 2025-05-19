"use client"

import { useState } from "react"
import { generateBackupCodes } from "@/app/actions/auth-actions"
import { logAuthEvent } from "@/app/actions/auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"

export default function BackupCodesGenerator() {
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateBackupCodes = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newBackupCodes = await generateBackupCodes()
      setBackupCodes(newBackupCodes)
      await logAuthEvent(AUTH_EVENTS.BACKUP_CODES_GENERATED, AUTH_STATUS.SUCCESS)
    } catch (e: any) {
      setError(e.message || "Failed to generate backup codes.")
      await logAuthEvent(AUTH_EVENTS.BACKUP_CODES_GENERATED, AUTH_STATUS.FAILURE, e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={handleGenerateBackupCodes}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Generate Backup Codes"}
      </button>

      {backupCodes.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Your Backup Codes:</h3>
          <ul>
            {backupCodes.map((code) => (
              <li key={code} className="mb-2">
                {code}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">
            Please save these backup codes in a safe place. You will need them if you lose access to your authentication
            app.
          </p>
        </div>
      )}
    </div>
  )
}
