import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Sign Up Page</h1>
      <p className="mb-4">This page is temporarily disabled while we set up the CMS.</p>
      <div className="flex flex-col gap-2 items-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Go to Admin Panel
        </Link>
      </div>
    </div>
  )
}
