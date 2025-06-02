"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { MenuIcons } from "@/components/menu-icons"
import SearchPopup from "@/components/search-popup"
import SideMenu from "@/components/side-menu"
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

      // Use different thresholds to prevent flashing - adjusted for smaller header
      const isAtTop = scrollState.isAtTop ? currentScrollY < 60 : currentScrollY < 30
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

      {/* Page Content */}
      <div className={cn("transition-all duration-300", scrollState.isAtTop ? "pt-0" : "pt-14")}>{children}</div>
      {!user && <SignupPopup />}
    </>
  )
}
