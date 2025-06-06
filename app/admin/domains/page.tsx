import { createClient } from "@/lib/supabase/server"
import DomainAdminClient from "./domain-admin-client"

export default async function DomainAdminPage() {
  const supabase = createClient()

  // Get domains with pagination
  const { data: domains, error } = await supabase
    .from("domains")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching domains:", error)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Domain Management</h1>
      <DomainAdminClient initialDomains={domains || []} />
    </div>
  )
}
