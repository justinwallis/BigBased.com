export const dynamic = "force-dynamic"

export default async function CMSTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">CMS Test Page</h1>
      <p className="mb-6">This is a simplified test page for Payload CMS integration.</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">CMS Status</h2>
        <p>
          The CMS is currently being set up. You can try accessing the admin panel at{" "}
          <a href="/cms-admin" className="text-blue-500 hover:underline">
            /cms-admin
          </a>
          .
        </p>
      </div>
    </div>
  )
}
