import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect to the Payload admin
  redirect("/admin/dashboard")
}
