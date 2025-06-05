"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

interface Profile {
  id: string
  name: string
  email: string
  bio: string
  location: string
  social_links: {
    website: string
    twitter: string
    github: string
    linkedin: string
  }
  profile_image: string
}

const ProfileClientPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/profile?email=${session.user.email}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data) {
          setProfile(data)
        } else {
          setError("Profile not found.")
        }
      } catch (e: any) {
        setError(`Failed to fetch profile: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const updatedProfileData: { [key: string]: string } = {}
    for (const [key, value] of formData.entries()) {
      if (value && typeof value === "string") {
        updatedProfileData[key] = value
      }
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          ...updatedProfileData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
      toast.success("Profile updated successfully!")
      router.refresh()
    } catch (e: any) {
      toast.error(`Failed to update profile: ${e.message}`)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!profile) {
    return <div>No profile data available.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="mb-4">
        <img
          src={profile.profile_image || "/placeholder.svg"}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover"
        />
      </div>

      <form onSubmit={handleUpdateProfile} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={profile.name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={profile.location}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
            Website:
          </label>
          <input
            type="text"
            id="website"
            name="website"
            defaultValue={profile?.social_links?.website}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="twitter" className="block text-gray-700 text-sm font-bold mb-2">
            Twitter:
          </label>
          <input
            type="text"
            id="twitter"
            name="twitter"
            defaultValue={profile?.social_links?.twitter}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="github" className="block text-gray-700 text-sm font-bold mb-2">
            GitHub:
          </label>
          <input
            type="text"
            id="github"
            name="github"
            defaultValue={profile?.social_links?.github}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="linkedin" className="block text-gray-700 text-sm font-bold mb-2">
            LinkedIn:
          </label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            defaultValue={profile?.social_links?.linkedin}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Social Links</h2>
        <ul>
          {profile?.social_links && typeof profile.social_links === "object" ? (
            <>
              {profile.social_links.website && typeof profile.social_links.website === "string" && (
                <li>
                  <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </li>
              )}
              {profile.social_links.twitter && typeof profile.social_links.twitter === "string" && (
                <li>
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
              )}
              {profile.social_links.github && typeof profile.social_links.github === "string" && (
                <li>
                  <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
              {profile.social_links.linkedin && typeof profile.social_links.linkedin === "string" && (
                <li>
                  <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
            </>
          ) : (
            <li>No social links available.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ProfileClientPage
