import { Suspense } from "react"
import EmailNotificationsClientPage from "./EmailNotificationsClientPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailNotificationsPage() {
  return (
    <div className="bb-2025-page min-h-screen">
      <Suspense
        fallback={
          <div className="bb-2025-container py-10 px-4">
            <Card className="bb-2025-panel">
              <CardHeader>
                <CardTitle>Loading Email Notifications...</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Please wait while we load your notification preferences.</p>
              </CardContent>
            </Card>
          </div>
        }
      >
        <EmailNotificationsClientPage />
      </Suspense>
    </div>
  )
}
