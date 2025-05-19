"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { verifyBackupCode } from "@/app/actions/mfa-actions"

interface BackupCodeVerificationProps {
  onComplete: () => void
  onBack: () => void
}

export function BackupCodeVerification({ onComplete, onBack }: BackupCodeVerificationProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // Format code as user types (XXXX-XXXX-XXXX)
  const handleCodeChange = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

    // Format with hyphens
    let formatted = ""
    for (let i = 0; i < cleaned.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += "-"
      }
      formatted += cleaned[i]
    }

    setCode(formatted)
  }

  // Handle verification
  const handleVerify = async () => {
    if (code.length < 14) {
      // XXXX-XXXX-XXXX = 14 chars
      setError("Please enter a complete backup code")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      // For demo purposes, accept a specific code
      if (code === "DEMO-CODE-1234") {
        setTimeout(() => {
          onComplete()
        }, 1000)
        return
      }

      const result = await verifyBackupCode(code)
      if (result.success) {
        onComplete()
      } else {
        setError(result.error || "Invalid backup code")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter Backup Code</CardTitle>
        <CardDescription>Enter one of your backup codes to sign in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            className="font-mono text-center text-lg"
            disabled={isVerifying}
            maxLength={14}
          />

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="text-xs text-muted-foreground">Enter a backup code in the format XXXX-XXXX-XXXX</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isVerifying}>
          Back
        </Button>
        <Button onClick={handleVerify} disabled={code.length < 14 || isVerifying}>
          {isVerifying ? (
            <>
              <span className="mr-2">Verifying</span>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
