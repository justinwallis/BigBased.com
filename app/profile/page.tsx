import { Suspense } from "react"
import ProfileClientPage from "./ProfileClientPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="bb-2025-page min-h-screen">
      <Suspense
        fallback={
          <div className="bb-2025-container py-10 px-4">
            <Card className="bb-2025-panel">
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
