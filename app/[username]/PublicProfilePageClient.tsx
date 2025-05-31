"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PublicProfilePageClientProps {
  initialUser: User | null
}

const PublicProfilePageClient: React.FC<PublicProfilePageClientProps> = ({ initialUser }) => {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!initialUser) {
      setIsLoading(true)
      fetch(`/api/user/${username}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data)
        })
        .catch((error) => {
          console.error("Error fetching user:", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [initialUser, username])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Skeleton className="h-20 w-20 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">User not found.</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Big Based
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="mb-4 bg-transparent dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Big Based
      </Button>

      {/* Rest of the profile page content */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">@{user?.username}</p>
        <Avatar className="h-20 w-20 mt-4 mx-auto">
          <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export { PublicProfilePageClient }
export default PublicProfilePageClient
