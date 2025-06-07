import { getPayload } from "../payload/payload"

export const dynamic = "force-dynamic"

export default async function CMSTestPage() {
  let pageData = null
  let error = null

  try {
    const payload = await getPayload()
    const response = await payload.find({
      collection: "pages",
    })
    pageData = response
  } catch (err) {
    error = err.message
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CMS Test Page</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>
            <strong>Success!</strong> CMS is connected.
          </p>
          <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(pageData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
