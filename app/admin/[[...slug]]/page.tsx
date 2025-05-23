import { redirect } from "next/navigation"

export default function AdminPage() {
  redirect("/api/admin")
  return null
}
