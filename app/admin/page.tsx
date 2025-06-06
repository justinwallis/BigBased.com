import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/domains" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Domain Management</h2>
          <p className="text-gray-600">Manage domains, settings, and features</p>
        </Link>

        <Link href="/admin/analytics" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600">View site analytics and performance metrics</p>
        </Link>

        <Link href="/admin/users" className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </Link>
      </div>
    </div>
  )
}
