"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function JoinButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/auth/sign-up")
  }

  return (
    <Button onClick={handleClick} size="sm" className="bg-primary hover:bg-primary/90 text-white">
      Join
    </Button>
  )
}
