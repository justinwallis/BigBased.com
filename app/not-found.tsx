import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function NotFound() {
  const session = useSession()
  const user = session?.data?.user

  if (user) {
    redirect("/")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go Home
      </a>
    </div>
  )
}
