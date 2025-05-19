"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { getUserProfile, updateUserProfile } from "../actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2, User, Shield, History } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { redirect } from "next/navigation"
import Link from "next/link"

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  website: string | null
  bio: string | null
}

export default function ProfileClientPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [website, setWebsite] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        const profileData = await getUserProfile(user.id)
        setProfile(profileData)

        // Initialize form values
        if (profileData) {
          setUsername(profileData.username || "")
          setFullName(profileData.full_name || "")
          setWebsite(profileData.website || "")
          setBio(profileData.bio || "")
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadProfile()
    } else if (!authLoading) {
      // Redirect to home if not logged in
      redirect("/")
    }
  }, [user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile(user.id, {
        username,
        full_name: fullName,
        website,
        bio,
      })

      setSuccess(true)

      // Update local profile state
      setProfile((prev) => {
        if (!prev) return null
        return {
          ...prev,
          username,
          full_name: fullName,
          website,
          bio,
        }
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || (isLoading && user)) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription>Profile updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden dark:bg-gray-700">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.username || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-gray-400 dark:text-gray-300" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{profile?.username || user.email?.split("@")[0]}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Link href="/profile/security/mfa">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">Trusted Devices</h4>
                <p className="text-sm text-muted-foreground">Manage devices that can skip 2FA</p>
              </div>
              <Link href="/profile/security/trusted-devices">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">Recovery Methods</h4>
                <p className="text-sm text-muted-foreground">Set up ways to recover your account</p>
              </div>
              <Link href="/profile/security/recovery-methods">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-muted-foreground">Update your password regularly for better security</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity
            </CardTitle>
            <CardDescription>View your account activity and security logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">Security Log</h4>
                <p className="text-sm text-muted-foreground">View login attempts and security events</p>
              </div>
              <Link href="/profile/security-log">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <h4 className="font-medium">Active Sessions</h4>
                <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
