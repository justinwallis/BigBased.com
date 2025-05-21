"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function JoinButtonConnector() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/auth/sign-up")} className="bg-primary hover:bg-primary/90 text-white">
      Join Now
    </Button>
  )
}
