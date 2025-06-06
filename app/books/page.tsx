// BigBased exclusive page
import { siteConfig } from "@/lib/site-config"
import { notFound } from "next/navigation"

export default function BooksPage() {
  // Only accessible from BigBased
  if (!siteConfig.isBigBased) {
    notFound()
  }

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
