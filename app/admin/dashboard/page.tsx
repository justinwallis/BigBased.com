import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Big Based Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Content Management</h2>
          <p className="text-gray-600 mb-4">Manage your website content including pages, blog posts, and media.</p>
          <Link href="/admin/payload">
            <Button className="w-full">Access CMS</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Database Management</h2>
          <p className="text-gray-600 mb-4">Initialize and manage CMS database tables.</p>
          <Link href="/admin/init-db">
            <Button className="w-full">Initialize Database</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Website Preview</h2>
          <p className="text-gray-600 mb-4">View your website as visitors will see it.</p>
          <Link href="/">
            <Button className="w-full" variant="outline">
              View Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
