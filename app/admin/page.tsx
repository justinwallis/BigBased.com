import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Big Based",
  description: "Admin dashboard for Big Based",
}

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage users and permissions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage content and resources</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">Configure system settings</p>
        </div>
      </div>
    </div>
  )
}
