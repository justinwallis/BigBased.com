import { getAllDomains } from "@/app/actions/domain-actions"
import DomainAdminClient from "./domain-admin-client"

export default async function DomainsAdminPage() {
  const { success, data: domains, error } = await getAllDomains()

  if (!success) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Domains</h2>
        <p className="text-red-600">{error || "Failed to load domains"}</p>
      </div>
    )
  }

  return <DomainAdminClient initialDomains={domains || []} />
}
