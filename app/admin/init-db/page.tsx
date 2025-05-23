"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { initPayloadDb } from "@/app/actions/init-payload-db"
import { ArrowLeft, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InitDbPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitDb = async () => {
    setIsLoading(true)
    try {
      const res = await initPayloadDb()
      setResult(res)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>
      </Button>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Initialize Database
          </CardTitle>
          <CardDescription>Set up the required database tables for Payload CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This will create all necessary tables for Payload CMS to function properly. If tables already exist, they
            will be updated to the latest schema.
          </p>
          {result && (
            <div
              className={`p-3 rounded-md mb-4 ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {result.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitDb} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
