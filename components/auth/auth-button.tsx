"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function AuthButton() {
  const { user, signOut, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="outline">Profile</Button>
        </Link>
        <Button onClick={() => signOut()} variant="ghost">
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="outline">Sign in</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign up</Button>
      </Link>
    </div>
  )
}
