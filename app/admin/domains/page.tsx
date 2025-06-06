import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Domain Management | Big Based",
  description: "Manage domains and subdomains",
}

export default function DomainsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Domain Management</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Domain Configuration</h2>
        <p className="text-gray-600 dark:text-gray-300">Manage domains and subdomains</p>
      </div>
    </div>
  )
}
