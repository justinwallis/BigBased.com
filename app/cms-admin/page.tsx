import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function CMSAdminPage() {
  redirect("/api/payload/admin")
  return null
}
