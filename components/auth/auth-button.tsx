"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, UserCircle } from "lucide-react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-[90px] h-[40px] bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800">
              <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
              <AvatarFallback className="bg-blue-500 text-white">
                {session.user.name?.[0]?.toUpperCase() || <UserCircle className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-gray-900 rounded-full p-0.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/profile/billing">Billing</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/profile/security">Security</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => signIn()}>
        Sign in
      </Button>
      <Button size="sm" onClick={() => signIn()}>
        Sign up
      </Button>
    </div>
  )
}
