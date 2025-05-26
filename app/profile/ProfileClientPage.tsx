"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Profile {
  id: string
  userId: string
  name: string
  bio: string
  social_links: {
    x: string
    instagram: string
    youtube: string
    tiktok: string
    facebook: string
    linkedin: string
    github: string
    telegram: string
    discord: string
    website: string
    therealworld: string
    rumble: string
  }
}

const ProfileClientPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<Partial<Profile>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/profile?userId=${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            setFormData(data)
          } else {
            console.error("Failed to fetch profile:", response.status)
            toast.error("Failed to fetch profile")
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
          toast.error("Error fetching profile")
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (status === "authenticated") {
      fetchProfile()
    }
  }, [session?.user?.id, status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      social_links: {
        ...formData.social_links,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        router.refresh()
      } else {
        console.error("Failed to update profile:", response.status)
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-[90%] max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              <Skeleton className="h-4 w-20" />
            </Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">
              <Skeleton className="h-4 w-20" />
            </Label>
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="x">
              <Skeleton className="h-4 w-20" />
            </Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <Button disabled>
            <Skeleton className="h-6 w-24" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[90%] max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Make changes to your profile here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your Name" value={formData.name || ""} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            name="bio"
            placeholder="Write a short bio about yourself."
            value={formData.bio || ""}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label>Social Links</Label>
          <Label htmlFor="x">X (Twitter)</Label>
          <Input
            id="x"
            name="x"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.x || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.instagram || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            name="youtube"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.youtube || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="tiktok">TikTok</Label>
          <Input
            id="tiktok"
            name="tiktok"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.tiktok || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.facebook || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="linkedin"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.linkedin || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="github"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.github || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            name="telegram"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.telegram || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            name="discord"
            placeholder="Username#1234 or server invite"
            value={formData.social_links?.discord || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            placeholder="https://yourwebsite.com"
            value={formData.social_links?.website || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="therealworld">The Real World</Label>
          <Input
            id="therealworld"
            name="therealworld"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.therealworld || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />

          <Label htmlFor="rumble">Rumble</Label>
          <Input
            id="rumble"
            name="rumble"
            placeholder="Just add username (e.g., johndoe)"
            value={formData.social_links?.rumble || ""}
            onChange={handleSocialLinkChange}
            className="mt-1"
          />
        </div>

        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProfileClientPage
