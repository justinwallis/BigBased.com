"use client"

import { useState } from "react"
import Link from "next/link"

export default function ClientPage() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 md:px-16 relative z-30">
        <div className="flex items-center space-x-8">
          <button onClick={() => setIsSideMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded">
            ☰
          </button>
          <Link href="/" className="font-bold text-2xl">
            Big Based
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="font-medium hover:text-gray-600 transition-colors duration-200">
              About
            </Link>
            <Link href="/blog" className="font-medium hover:text-gray-600 transition-colors duration-200">
              Blog
            </Link>
            <Link href="/contact" className="font-medium hover:text-gray-600 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={() => setIsSearchPopupOpen(true)}
          >
            🔍
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Big Based</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Your platform for truth, faith, and freedom.</p>
        <Link
          href="/about"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Learn More
        </Link>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Big Based is committed to restoring truth, faith, and freedom in a world increasingly dominated by
              deception and control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Truth</h3>
              <p className="text-gray-600">Uncovering and preserving truth in an age of misinformation.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Faith</h3>
              <p className="text-gray-600">Strengthening faith and spiritual foundations in our communities.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Freedom</h3>
              <p className="text-gray-600">Defending and promoting freedom in all its forms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8 md:px-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl mb-8">Be part of the cultural revolution that's changing the world.</p>
          <Link
            href="/admin"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© 2025 Big Based. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
