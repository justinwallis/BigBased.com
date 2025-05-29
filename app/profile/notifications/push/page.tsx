import type { Metadata } from "next"
import PushNotificationsClientPage from "./PushNotificationsClientPage"

export const metadata: Metadata = {
  title: "Push Notifications - Big Based",
  description: "Manage your push notification preferences",
}

export default function PushNotificationsPage() {
  return <PushNotificationsClientPage />
}
