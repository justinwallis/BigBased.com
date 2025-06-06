import { Suspense } from "react"
import EmailNotificationsClientPage from "./EmailNotificationsClientPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailNotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="container mx-auto py-10">
            <Card>
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
