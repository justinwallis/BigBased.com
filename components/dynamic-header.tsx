"use client"

import { siteConfig } from "@/lib/site-config"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function DynamicHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Dynamic Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={siteConfig.logo || "/placeholder.svg"} alt={siteConfig.siteName} width={40} height={40} />
          <div>
            <span className="text-xl font-bold" style={{ color: siteConfig.colors.primary }}>
              {siteConfig.siteName}
            </span>
            <div className="text-xs text-gray-500">{siteConfig.tagline}</div>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="hidden md:flex space-x-6">
          {siteConfig.navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth buttons (same for both sites) */}
        <div className="flex space-x-2">
          <Link href="/auth/sign-in">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm" style={{ backgroundColor: siteConfig.colors.primary }}>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
