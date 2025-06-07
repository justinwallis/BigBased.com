export const dynamic = "force-dynamic"

async function getPages() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/api/cms/pages`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch pages")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching pages:", error)
    return { docs: [], error: error.message }
  }
}

export default async function CMSTestPage() {
  const data = await getPages()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CMS Test Page</h1>

      {data.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p>
            <strong>Error:</strong> {data.error}
          </p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <p>
            <strong>Success!</strong> CMS is working.
          </p>
          <p>Found {data.docs?.length || 0} pages.</p>
          {data.docs?.length > 0 && (
            <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data.docs, null, 2)}</pre>
          )}
        </div>
      )}

      <div className="mt-6">
        <a href="/admin/cms" className="text-blue-500 hover:underline">
          Go to CMS Admin →
        </a>
      </div>
    </div>
  )
}
