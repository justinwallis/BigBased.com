import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="mb-8 max-w-md mx-auto">
          The page you're looking for is currently under construction or doesn't exist. We're working hard to build out
          all sections of the Big Based platform.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
