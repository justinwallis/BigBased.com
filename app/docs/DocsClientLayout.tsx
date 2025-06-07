"use client"

import type React from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronRight, Menu, X, BookOpen, Shield, Zap, Building, Code, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Client component for collapsible navigation
function CollapsibleNavItem({
  title,
  children,
  defaultOpen = false,
  icon,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && <div className="ml-4 space-y-1">{children}</div>}
    </div>
  )
}

// Client component for mobile menu
function MobileMenu({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(true)}>
        <Menu className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-black p-6 border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/docs/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default function DocsClientLayout({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: any[]
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 pl-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-6">
          <div className="space-y-2">
            <CollapsibleNavItem title="Getting Started" defaultOpen={true} icon={<BookOpen className="h-4 w-4" />}>
              <Link
                href="/docs/platform-architecture/introduction"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Introduction
              </Link>
              <Link
                href="/docs/platform-architecture/quick-start-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Quick Start Guide
              </Link>
              <Link
                href="/docs/platform-architecture/system-requirements"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                System Requirements
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Authentication & Security" icon={<Shield className="h-4 w-4" />}>
              <Link
                href="/docs/multi-factor-authentication/setup-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                MFA Setup Guide
              </Link>
              <Link
                href="/docs/multi-factor-authentication/troubleshooting"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                MFA Troubleshooting
              </Link>
              <Link
                href="/docs/security-features/overview"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Security Overview
              </Link>
              <Link
                href="/docs/security-features/best-practices"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Security Best Practices
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Platform Features" icon={<Zap className="h-4 w-4" />}>
              <Link
                href="/docs/profile-customization/user-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Profile Customization
              </Link>
              <Link
                href="/docs/admin-panel-guide/overview"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Admin Panel Guide
              </Link>
              <Link
                href="/docs/cms-guide/content-management"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Content Management
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Enterprise Features" icon={<Building className="h-4 w-4" />}>
              <Link
                href="/docs/enterprise-knowledge-graph/overview"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Knowledge Graph
              </Link>
              <Link
                href="/docs/shop-system/setup-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Shop System Setup
              </Link>
              <Link
                href="/docs/shop-system/management-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Shop Management
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="API & Integration" icon={<Code className="h-4 w-4" />}>
              <Link
                href="/docs/api-integration/getting-started"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                API Getting Started
              </Link>
              <Link
                href="/docs/api-integration/authentication"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                API Authentication
              </Link>
              <Link
                href="/docs/api-integration/endpoints"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                API Endpoints
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Community & Support" icon={<Users className="h-4 w-4" />}>
              <Link
                href="/docs/community-forum/getting-started"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Forum Getting Started
              </Link>
              <Link
                href="/docs/community-forum/moderation-guide"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Moderation Guide
              </Link>
              <Link
                href="/community"
                className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Visit Community
              </Link>
            </CollapsibleNavItem>

            {/* Additional Resources */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Resources
              </h4>
              <div className="space-y-1">
                <Link
                  href="/docs/api-reference"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  API Reference
                </Link>
                <Link
                  href="/docs/tutorials"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Tutorials
                </Link>
                <Link
                  href="/docs/changelog"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Changelog
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
            Big Based
          </Link>
          <MobileMenu categories={categories} />
        </div>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
