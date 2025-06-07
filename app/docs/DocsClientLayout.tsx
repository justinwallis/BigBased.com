"use client"

import type React from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Client component for collapsible navigation
function CollapsibleNavItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <span>{title}</span>
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
          <div className="fixed left-0 top-0 h-full w-80 bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Documentation</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/docs/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
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
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-800 bg-gray-900">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-600 bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-6">
          <div className="space-y-2">
            <CollapsibleNavItem title="Getting Started" defaultOpen={true}>
              <Link
                href="/docs/getting-started/introduction"
                className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Introduction
              </Link>
              <Link
                href="/docs/getting-started/quick-start"
                className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Quick Start
              </Link>
              <Link
                href="/docs/getting-started/installation"
                className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Installation
              </Link>
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Platform Features">
              {categories
                .filter((cat) => cat.name.includes("Platform"))
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/${category.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {category.name.replace("Platform ", "")}
                  </Link>
                ))}
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Security & Authentication">
              {categories
                .filter((cat) => cat.name.includes("Security") || cat.name.includes("Authentication"))
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/${category.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Enterprise Features">
              {categories
                .filter(
                  (cat) => cat.name.includes("Enterprise") || cat.name.includes("CMS") || cat.name.includes("Shop"),
                )
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/${category.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
            </CollapsibleNavItem>

            <CollapsibleNavItem title="API & Integration">
              {categories
                .filter((cat) => cat.name.includes("API") || cat.name.includes("Integration"))
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/${category.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
            </CollapsibleNavItem>

            <CollapsibleNavItem title="Community & Support">
              {categories
                .filter((cat) => cat.name.includes("Community") || cat.name.includes("Support"))
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/${category.slug}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
            </CollapsibleNavItem>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 md:hidden">
          <Link href="/" className="text-lg font-bold">
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
