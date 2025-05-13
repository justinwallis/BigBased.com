import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Big Based</h1>

        <p className="mb-4">
          Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and
          building a parallel economy based on freedom and responsibility.
        </p>

        <p className="mb-4">
          Our mission is to provide tools, knowledge, and community for those seeking to break free from manipulation
          and censorship while fostering connections between freedom-minded individuals.
        </p>

        <p className="mb-8">
          Founded on principles of truth, faith, and freedom, Big Based offers a comprehensive library of resources,
          community connections, and practical solutions for navigating the challenges of our time.
        </p>

        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
