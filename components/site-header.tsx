"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import AuthButton from "@/components/auth/auth-button"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Search,
  Layers,
  Monitor,
  Layout,
  Smartphone,
  Code,
  FileText,
  ImageIcon,
  PresentationIcon,
  Type,
  Shapes,
  Box,
  VideoIcon as Vector,
  CuboidIcon as Cube,
  ShoppingBag,
  Users,
  Building2,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import MegaMenu from "@/components/mega-menu"
import SearchPopup from "@/components/search-popup"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Transform", href: "/transform" },
  { name: "Contact", href: "/contact" },
]

// Define the features mega menu content
const featuresMegaMenu = {
  sections: [
    {
      title: "UX/UI",
      items: [
        {
          icon: <Layers className="h-5 w-5" />,
          label: "Framer Templates",
          href: "/features/framer-templates",
        },
        {
          icon: <Monitor className="h-5 w-5" />,
          label: "Web UI Kits",
          href: "/features/web-ui-kits",
        },
        {
          icon: <Layout className="h-5 w-5" />,
          label: "Wireframes",
          href: "/features/wireframes",
        },
        {
          icon: <Smartphone className="h-5 w-5" />,
          label: "Mobile UI Kits",
          href: "/features/mobile-ui-kits",
        },
        {
          icon: <Code className="h-5 w-5" />,
          label: "Coded Templates",
          href: "/features/coded-templates",
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: "Notion Templates",
          href: "/features/notion-templates",
        },
      ],
    },
    {
      title: "GRAPHICS",
      items: [
        {
          icon: <ImageIcon className="h-5 w-5" />,
          label: "Mockups",
          href: "/features/mockups",
        },
        {
          icon: <PresentationIcon className="h-5 w-5" />,
          label: "Presentations",
          href: "/features/presentations",
        },
        {
          icon: <Type className="h-5 w-5" />,
          label: "Fonts",
          href: "/features/fonts",
        },
        {
          icon: <Shapes className="h-5 w-5" />,
          label: "Icons",
          href: "/features/icons",
        },
        {
          icon: <Box className="h-5 w-5" />,
          label: "Objects",
          href: "/features/objects",
        },
      ],
    },
    {
      title: "ILLUSTRATIONS",
      items: [
        {
          icon: <Vector className="h-5 w-5" />,
          label: "Vector",
          href: "/features/vector",
        },
        {
          icon: <Cube className="h-5 w-5" />,
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
          icon: <ShoppingBag className="h-5 w-5" />,
          label: "Open a shop",
          href: "/features/open-shop",
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Become an affiliate",
          href: "/features/become-affiliate",
        },
      ],
    },
    {
      title: "NEED HELP?",
      items: [
        {
          icon: <Building2 className="h-5 w-5" />,
          label: "Contacts",
          href: "/contact",
        },
        {
          icon: <HelpCircle className="h-5 w-5" />,
          label: "F.A.Q.",
          href: "/faq",
        },
      ],
    },
  ],
  promoItem: {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Magic launch",
    subtitle: "Spring 2024",
  },
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if scrolled past threshold
      setScrolled(currentScrollY > 10)

      // Determine scroll direction and visibility
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold - hide header
        setVisible(false)
      } else {
        // Scrolling up or at top - show header
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial check
    handleScroll()

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <SearchPopup isOpen={isSearchPopupOpen} onClose={() => setIsSearchPopupOpen(false)} />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] w-full border-b transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
            : "bg-background",
          visible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 w-full max-w-[1150px] mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/bb-logo.png"
                  alt="Big Based Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl">BigBased</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
            <MegaMenu
              label="Features"
              sections={featuresMegaMenu.sections}
              sideSections={featuresMegaMenu.sideSections}
              promoItem={featuresMegaMenu.promoItem}
              className="text-sm font-medium"
            />
          </nav>

          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchPopupOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Auth Button */}
            <div className="hidden md:block">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 border-t bg-background">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/features"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/features" ? "text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <div className="pt-2">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Add a spacer to prevent content from being hidden under the header */}
      <div className="h-16"></div>
    </>
  )
}
