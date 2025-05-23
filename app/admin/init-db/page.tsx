"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Database } from "lucide-react"
import Link from "next/link"
import { initializePayloadDatabase } from "@/app/actions/init-payload-db"

export default function InitDbPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitDb = async () => {
    setLoading(true)
    try {
      const result = await initializePayloadDatabase()
      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Initialize Payload Database</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Database className="h-16 w-16 text-blue-600 dark:text-blue-400" />
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          This will initialize the Payload CMS database with default collections and create an admin user if one doesn't
          exist. This is safe to run multiple times as it will not overwrite existing data.
        </p>

        {result && (
          <div
            className={`p-4 mb-6 rounded-md ${
              result.success
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
            }`}
          >
            {result.message}
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={handleInitDb} disabled={loading} size="lg">
            {loading ? "Initializing..." : "Initialize Database"}
          </Button>
        </div>

        {result?.success && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-2">Default admin credentials:</p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> admin@bigbased.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Password:</strong> BigBased2024!
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Please change these credentials after your first login.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/admin/payload">Go to Payload CMS Admin</Link>
        </Button>
      </div>
    </div>
  )
}
