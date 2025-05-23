"use client"

import type { Viewport } from "next/types"
import { viewportConfig } from "./metadata-config"
import { useState } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"

export const viewport: Viewport = viewportConfig

// Simple Hero Component
function SimpleHero() {
  return (
    <div className="relative bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Big Based</h1>
          <p className="text-xl mb-8">Your platform for truth, faith, and freedom.</p>
          <Link
            href="/about"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}

// Simple Footer Component
function SimpleFooter() {
  return (
    <footer className="border-t py-8 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300">© 2025 Big Based. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Contact
            </Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Simple Side Menu Component
function SimpleSideMenu({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />

      {/* Side Menu */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300">
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="block py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="block py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="block py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block py-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default function ClientPage() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)
  const { theme } = useTheme()

  const handleSearchClick = () => {
    setIsSearchPopupOpen(true)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Side Menu */}
      <SimpleSideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} />

      {/* Search Popup */}
      {isSearchPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Search</h3>
              <button onClick={() => setIsSearchPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 md:px-16 relative z-30 dark:text-white">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setIsSideMenuOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            ☰
          </button>
          <Link href="/" className="font-bold text-2xl">
            Big Based
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
            onClick={handleSearchClick}
          >
            <Search className="h-5 w-5 dark:text-white" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero">
        <SimpleHero />
      </section>

      {/* Content Sections */}
      <section className="py-16 px-8 md:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Big Based is committed to restoring truth, faith, and freedom in a world increasingly dominated by
              deception and control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Truth</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Uncovering and preserving truth in an age of misinformation.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Faith</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Strengthening faith and spiritual foundations in our communities.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Freedom</h3>
              <p className="text-gray-600 dark:text-gray-300">Defending and promoting freedom in all its forms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8 md:px-16 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl mb-8">Be part of the cultural revolution that's changing the world.</p>
          <Link
            href="/about"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      <SimpleFooter />
    </main>
  )
}
