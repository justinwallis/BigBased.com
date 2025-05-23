import { redirect } from "next/navigation"

// Make this page dynamic
export const dynamic = "force-dynamic"

export default function AdminPage() {
  // Check if we're in development or if Payload is available
  const isPayloadAvailable = process.env.PAYLOAD_SECRET && !process.env.NODE_ENV?.includes("build")

  if (!isPayloadAvailable) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p className="text-gray-600">The admin panel is not available at this time. Please check your configuration.</p>
      </div>
    )
  }

  // Redirect to the Payload admin panel
  redirect("/api/payload/admin")
}
