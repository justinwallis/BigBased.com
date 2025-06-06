import { Suspense } from "react"
import ProfileClientPage from "./ProfileClientPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
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
        }
      >
        <ProfileClientPage />
      </Suspense>
    </div>
  )
}
