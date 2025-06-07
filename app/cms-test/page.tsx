import payload from "payload"

// Set dynamic rendering for this page
export const dynamic = "force-dynamic"

async function getPages() {
  try {
    // Initialize Payload if needed
    if (!payload.initialized) {
      await payload.init({
        secret: process.env.PAYLOAD_SECRET || "a-very-secure-secret-key",
        local: true,
      })
    }

    // Get pages from Payload
    const pages = await payload.find({
      collection: "pages",
    })

    return pages
  } catch (error) {
    console.error("Error fetching pages:", error)
    return { docs: [] }
  }
}

export default async function CMSTestPage() {
  const { docs: pages } = await getPages()

  if (!pages || pages.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">CMS Test Page</h1>
        <p>
          No pages found in the CMS. Please add some content in the{" "}
          <a href="/cms-admin" className="text-blue-500 hover:underline">
            CMS Admin
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">CMS Test Page</h1>
      <p className="mb-6">This page displays content from Payload CMS.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page: any) => (
          <div key={page.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
            <p className="text-gray-600 mb-2">Slug: {page.slug}</p>
            {page.publishedAt && (
              <p className="text-sm text-gray-500">Published: {new Date(page.publishedAt).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
