import { generateSafePageMetadata } from "@/lib/metadata-error-handler"

// Static metadata to prevent build errors
export const metadata = generateSafePageMetadata(
  "Big Based Book Reader",
  "Explore our exclusive collection of books on digital sovereignty, faith, freedom, and cultural resistance.",
)

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Big Based Book Reader</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Digital Sovereignty</h3>
          <p className="text-gray-600 mb-4">Explore the foundations of digital freedom...</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Read Now</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Faith & Freedom</h3>
          <p className="text-gray-600 mb-4">Understanding the intersection of faith and liberty...</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Read Now</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Cultural Resistance</h3>
          <p className="text-gray-600 mb-4">Strategies for preserving traditional values...</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Read Now</button>
        </div>
      </div>
    </div>
  )
}
