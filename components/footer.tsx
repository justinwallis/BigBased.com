"use client"

import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram, MessageSquare, Send, Map } from "lucide-react"
import { toggleSitemapEvent } from "./sitemap-container"
import Image from "next/image"

export default function Footer() {
  const handleSitemapToggle = () => {
    // Dispatch the custom event to toggle the sitemap
    window.dispatchEvent(new Event(toggleSitemapEvent))
  }

  return (
    <footer className="border-t-2 border-gray-400 dark:border-gray-600">
      <div className="container mx-auto px-8 md:px-16 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:flex-shrink-0">
            <Link href="/" className="font-bold text-2xl">
              <div className="w-12 h-12 relative">
                <Image src="/bb-logo.png" alt="BigBased Logo" fill className="object-contain" priority />
              </div>
            </Link>
          </div>

          {/* Short message with improved padding for mid-responsive state */}
          <div
            className="text-sm text-gray-600 dark:text-gray-300 max-w-md text-center md:text-left mb-4 md:mb-0 
                          px-2 md:px-6 lg:px-8 
                          md:mx-4 lg:mx-8"
          >
            Big Based is committed to restoring truth, faith, and freedom in a world increasingly dominated by deception
            and control.
          </div>

          <div className="flex space-x-4 md:flex-shrink-0">
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://youtube.com"
              aria-label="YouTube"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Youtube size={20} />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://discord.com"
              aria-label="Discord"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <MessageSquare size={20} />
            </Link>
            <Link
              href="https://telegram.org"
              aria-label="Telegram"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Send size={20} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <span>© 2025 BigBased. All Rights Reserved</span>
          </div>
          <div className="flex items-center mt-2 md:mt-0 space-x-2">
            <Link href="/privacy" className="hover:text-black dark:hover:text-white">
              Privacy Policy
            </Link>
            <span className="mx-1">|</span>
            <Link href="/disclaimer" className="hover:text-black dark:hover:text-white">
              Disclaimer
            </Link>
            <span className="mx-1">|</span>
            <button
              onClick={handleSitemapToggle}
              className="flex items-center hover:text-black dark:hover:text-white focus:outline-none"
              aria-label="Open sitemap"
            >
              <Map size={16} className="mr-1" />
              <span>Sitemap</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
