import { redirect } from "next/navigation"

export default function AdminPage({ params }: { params: { path?: string[] } }) {
  // If no path is provided, redirect to the admin dashboard
  if (!params.path || params.path.length === 0) {
    redirect("/admin/dashboard")
  }

  // Otherwise, let the catch-all route handle it
  return null
}
