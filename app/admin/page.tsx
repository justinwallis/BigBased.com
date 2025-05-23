import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect to the Payload admin panel
  redirect("/api/payload/admin")

  // This won't be rendered, but Next.js requires a component to be returned
  return null
}
