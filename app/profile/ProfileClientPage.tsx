import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileClientPage() {
  const sessionData = useSession()
  const { data: session, status } = sessionData || { data: null, status: "loading" }

  if (status === "loading") {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we load your profile information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>{session?.user?.name ? <p>Welcome, {session?.user?.name}!</p> : <p>Welcome!</p>}</CardContent>
      </Card>
    </div>
  )
}
