"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"
import MegaMenu from "@/components/mega-menu"
import { MenuIcons } from "@/components/menu-icons"
import SearchPopup from "@/components/search-popup"
import SideMenu from "@/components/side-menu"
import BBLogo from "@/components/bb-logo"
import AuthButton from "@/components/auth/auth-button"
import { cn } from "@/lib/utils"
import { ErrorBoundary } from "@/components/error-boundary"
import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { SignupPopup } from "@/components/signup-popup"

// Define the features mega menu content
const featuresMegaMenu = {
  sections: [
    {
      title: "UX/UI",
      items: [
        {
          icon: MenuIcons.FramerTemplates,
          label: "Framer Templates",
          href: "/features/framer-templates",
        },
        {
          icon: MenuIcons.WebUIKits,
          label: "Web UI Kits",
          href: "/features/web-ui-kits",
        },
        {
          icon: MenuIcons.Wireframes,
          label: "Wireframes",
          href: "/features/wireframes",
        },
        {
          icon: MenuIcons.MobileUIKits,
          label: "Mobile UI Kits",
          href: "/features/mobile-ui-kits",
        },
        {
          icon: MenuIcons.CodedTemplates,
          label: "Coded Templates",
          href: "/features/coded-templates",
        },
        {
          icon: MenuIcons.NotionTemplates,
          label: "Notion Templates",
          href: "/features/notion-templates",
        },
      ],
    },
    {
      title: "GRAPHICS",
      items: [
        {
          icon: MenuIcons.Mockups,
          label: "Mockups",
          href: "/features/mockups",
        },
        {
          icon: MenuIcons.Presentations,
          label: "Presentations",
          href: "/features/presentations",
        },
        {
          icon: MenuIcons.Fonts,
          label: "Fonts",
          href: "/features/fonts",
        },
        {
          icon: MenuIcons.Icons,
          label: "Icons",
          href: "/features/icons",
        },
        {
          icon: MenuIcons.Objects,
          label: "Objects",
          href: "/features/objects",
        },
      ],
    },
    {
      title: "ILLUSTRATIONS",
      items: [
        {
          icon: MenuIcons.Vector,
          label: "Vector",
          href: "/features/vector",
        },
        {
          icon: MenuIcons.Assets3D,
          label: "3D Assets",
          href: "/features/3d-assets",
        },
      ],
    },
  ],
  sideSections: [
    {
      title: "WORK WITH US",
      items: [
        {
          icon: MenuIcons.OpenShop,
          label: "Open a shop",
          href: "/features/open-shop",
        },
        {
          icon: MenuIcons.BecomeAffiliate,
          label: "Become an affiliate",
          href: "/features/become-affiliate",
        },
      ],
    },
    {
      title: "NEED HELP?",
      items: [
        {
          icon: MenuIcons.Contacts,
          label: "Contacts",
          href: "/contact",
        },
        {
          icon: MenuIcons.FAQ,
          label: "F.A.Q.",
          href: "/faq",
        },
      ],
    },
  ],
  promoItem: {
    icon: MenuIcons.Magic,
    title: "Magic launch",
    subtitle: "Spring 2024",
  },
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [openWithSearch, setOpenWithSearch] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)
  const { theme } = useTheme()
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isScrollingUp: false,
    hasScrolledDown: false,
    lastScrollY: 0,
  })

  const { user } = useAuth()

  // Handle header visibility and transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Use different thresholds to prevent flashing
      const isAtTop = scrollState.isAtTop ? currentScrollY < 65 : currentScrollY < 35
      const isScrollingUp = currentScrollY < scrollState.lastScrollY
      const hasScrolledDown = currentScrollY > 150

      setScrollState({
        isAtTop,
        isScrollingUp,
        hasScrolledDown: hasScrolledDown || scrollState.hasScrolledDown,
        lastScrollY: currentScrollY,
      })
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollState.lastScrollY, scrollState.hasScrolledDown])

  const handleSearchClick = () => {
    setIsSearchPopupOpen(true)
  }

  // Determine if the header should be fixed
  const shouldBeFixed = !scrollState.isAtTop && (scrollState.isScrollingUp || !scrollState.hasScrolledDown)

  return (
    <>
      {/* Side Menu */}
      <ErrorBoundary>
        <SideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} openWithSearch={openWithSearch} />
      </ErrorBoundary>

      {/* Search Popup */}
      <SearchPopup isOpen={isSearchPopupOpen} onClose={() => setIsSearchPopupOpen(false)} />

      {/* Regular header at the top of the page */}
      {scrollState.isAtTop && (
        <nav className="z-50 w-full flex items-center justify-between px-8 py-1 md:px-16 dark:text-white dark:bg-black bg-transparent">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`font-bold text-2xl transition-transform duration-300 ${logoHovered ? "scale-110" : ""} flex items-center`}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div className="relative w-12 h-12 transition-all duration-300 flex items-center justify-center">
                <BBLogo size="md" />
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/about"
                className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
              >
                About
              </Link>
              <MegaMenu
                label="Features"
                sections={featuresMegaMenu.sections}
                sideSections={featuresMegaMenu.sideSections}
                promoItem={featuresMegaMenu.promoItem}
              />
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
            <AuthButton />
          </div>
        </nav>
      )}

      {/* Sticky header that appears when scrolling up */}
      {shouldBeFixed && (
        <nav
          className={cn(
            "fixed top-0 left-0 right-0 z-50 w-full",
            "flex items-center justify-between px-8 py-1 md:px-16 dark:text-white",
            "bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20",
            "transition-transform duration-300",
            scrollState.isScrollingUp ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`font-bold text-2xl transition-transform duration-300 ${logoHovered ? "scale-110" : ""} flex items-center`}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div className="relative w-12 h-12 transition-all duration-300 flex items-center justify-center">
                <BBLogo size="md" />
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/about"
                className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
              >
                About
              </Link>
              <MegaMenu
                label="Features"
                sections={featuresMegaMenu.sections}
                sideSections={featuresMegaMenu.sideSections}
                promoItem={featuresMegaMenu.promoItem}
              />
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
            <AuthButton />
          </div>
        </nav>
      )}

      {/* Page Content */}
      {children}
      {!user && <SignupPopup />}
    </>
  )
}
