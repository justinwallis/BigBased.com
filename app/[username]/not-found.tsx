import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProfileNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The profile you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/sign-up">Create Account</Link>
        </Button>
      </div>
    </div>
  )
}
