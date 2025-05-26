import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX, Home, Search } from "lucide-react"

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <UserX className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Profile Not Found</CardTitle>
            <CardDescription className="text-base">
              The profile you're looking for doesn't exist or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Profiles
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Make sure you've typed the username correctly.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
