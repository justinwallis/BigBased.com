import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const EmailNotificationsClientPage = () => {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <Link href="/profile?tab=notifications">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Button>
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold mt-6">Email Notifications</h1>
      {/* Add your email notification settings UI here */}
    </div>
  )
}

export default EmailNotificationsClientPage
