"use client"

import type React from "react"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Smartphone, Key, Download, Copy, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  generateAuthenticatorSecret,
  verifyAndEnableMfa,
  generateBackupCodes,
  disableMfa,
} from "@/app/actions/mfa-actions"
import type { User } from "@supabase/supabase-js"
import { ThemeToggle } from "@/components/theme-toggle"

interface TwoFactorClientPageProps {
  user: User
  currentMfaStatus: {
    enabled: boolean
    type: string | null
  }
}

export default function TwoFactorClientPage({ user, currentMfaStatus }: TwoFactorClientPageProps) {
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<"overview" | "setup" | "verify" | "backup-codes">("overview")
  const [qrCode, setQrCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedCodes, setCopiedCodes] = useState(false)
  const [mfaStatus, setMfaStatus] = useState(currentMfaStatus)
  const [qrError, setQrError] = useState<string>("")
  const { toast } = useToast()

  const handleSetupAuthenticator = () => {
    startTransition(async () => {
      const result = await generateAuthenticatorSecret(user.email || "")

      if (result.success && result.data) {
        setQrCode(result.data.qrCode)
        setSecret(result.data.secret)
        setStep("setup")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate authenticator secret",
          variant: "destructive",
        })
      }
    })
  }

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a verification code",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const result = await verifyAndEnableMfa(verificationCode)

      if (result.success) {
        setMfaStatus({ enabled: true, type: "authenticator" })

        // Generate backup codes automatically
        const backupResult = await generateBackupCodes()

        if (backupResult.success && backupResult.data) {
          setBackupCodes(backupResult.data.codes)
          setStep("backup-codes")
        } else {
          // Still proceed to backup codes step but show error
          setStep("backup-codes")
          toast({
            title: "Warning",
            description: "MFA enabled but failed to generate backup codes. You can generate them manually.",
            variant: "destructive",
          })
        }

        toast({
          title: "Success",
          description: "Two-factor authentication has been enabled",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to verify code",
          variant: "destructive",
        })
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && verificationCode.length === 6 && !isPending) {
      handleVerifyCode()
    }
  }

  const handleGenerateNewBackupCodes = () => {
    startTransition(async () => {
      const result = await generateBackupCodes()

      if (result.success && result.data) {
        setBackupCodes(result.data.codes)
        setCopiedCodes(false)
        setStep("backup-codes") // Change to backup-codes step to display the codes
        toast({
          title: "Success",
          description: "New backup codes generated",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate backup codes",
          variant: "destructive",
        })
      }
    })
  }

  const copyBackupCodes = () => {
    const codesText = backupCodes.join("\n")
    navigator.clipboard.writeText(codesText)
    setCopiedCodes(true)
    toast({
      title: "Copied",
      description: "Backup codes copied to clipboard",
    })
  }

  const handleDisableMfa = () => {
    startTransition(async () => {
      const result = await disableMfa()

      if (result.success) {
        setMfaStatus({ enabled: false, type: null })
        setStep("overview")
        toast({
          title: "Success",
          description: "Two-factor authentication has been disabled",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to disable MFA",
          variant: "destructive",
        })
      }
    })
  }

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join("\n")
    const blob = new Blob([codesText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "backup_codes.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 pb-8 pt-4">
        {/* Navigation */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Link href="/profile?tab=security" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Security
                </Link>
              </Button>
            </div>
            <ThemeToggle />
          </div>

          {step === "overview" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {mfaStatus.enabled ? "Currently enabled" : "Currently disabled"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={mfaStatus.enabled ? "default" : "secondary"}>
                    {mfaStatus.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                {!mfaStatus.enabled ? (
                  <>
                    <Separator />

                    {/* Setup Options */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Setup Methods</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Authenticator App</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Use Google Authenticator, Authy, or similar apps
                              </p>
                            </div>
                          </div>
                          <Button onClick={handleSetupAuthenticator} disabled={isPending}>
                            {isPending ? "Setting up..." : "Setup"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Separator />

                    {/* Enabled Options */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Manage 2FA</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">Backup Codes</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Generate new backup codes for account recovery
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={handleGenerateNewBackupCodes} disabled={isPending}>
                            Generate New
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-medium">Disable Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Remove two-factor authentication from your account
                              </p>
                            </div>
                          </div>
                          <Button variant="destructive" onClick={handleDisableMfa} disabled={isPending}>
                            Disable
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {step === "setup" && (
            <Card>
              <CardHeader>
                <CardTitle>Setup Authenticator App</CardTitle>
                <CardDescription>Scan the QR code with your authenticator app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white dark:bg-gray-100 rounded-lg border">
                    {qrCode ? (
                      <div className="relative">
                        <img
                          src={qrCode || "/placeholder.svg"}
                          alt="QR Code for 2FA setup"
                          className="w-48 h-48 block"
                          onError={(e) => {
                            console.error("QR code failed to load")
                            console.error("QR code data:", qrCode?.substring(0, 200))
                            setQrError("Failed to load QR code")
                            e.currentTarget.style.display = "none"
                          }}
                          onLoad={() => {
                            console.log("QR code loaded successfully")
                            setQrError("")
                          }}
                          style={{ display: qrError ? "none" : "block" }}
                        />
                        {qrError && (
                          <div className="w-48 h-48 bg-red-100 dark:bg-red-900/20 rounded flex flex-col items-center justify-center text-center p-4">
                            <p className="text-red-600 dark:text-red-400 text-sm mb-2">QR Code Error</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Use manual entry below</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Loading QR Code...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-2">
                  <Label>Manual Entry Key</Label>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(secret)
                        toast({ title: "Copied", description: "Secret key copied to clipboard" })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you can't scan the QR code, enter this key manually in your authenticator app
                  </p>
                </div>

                <Separator />

                {/* Instructions */}
                <div className="space-y-3">
                  <h4 className="font-medium">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code or enter the manual key above</li>
                    <li>Enter the 6-digit code from your app below</li>
                  </ol>
                </div>

                <Button variant="outline" onClick={() => setStep("verify")} className="w-full">
                  Continue to Verification
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "verify" && (
            <Card>
              <CardHeader>
                <CardTitle>Verify Setup</CardTitle>
                <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={handleKeyDown}
                    className="text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter the 6-digit code shown in your authenticator app (press Enter to verify)
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("setup")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyCode}
                    disabled={isPending || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isPending ? "Verifying..." : "Verify & Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "backup-codes" && (
            <Card>
              <CardHeader>
                <CardTitle>Backup Codes Generated</CardTitle>
                <CardDescription>
                  Save these backup codes in a safe place. You can use them to access your account if you lose your
                  authenticator device.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Backup Codes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Your Backup Codes</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyBackupCodes} className="flex items-center gap-2">
                        {copiedCodes ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedCodes ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadBackupCodes}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Each backup code can only be used once. Store them securely and don't
                      share them with anyone.
                    </p>
                  </div>
                </div>

                <Button onClick={() => setStep("overview")} className="w-full">
                  Complete Setup
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
