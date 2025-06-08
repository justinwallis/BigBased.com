"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { checkUserMfaStatus } from "@/app/actions/mfa-actions"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { theme } = useTheme()
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isScrollingUp: false,
    hasScrolledDown: false,
    lastScrollY: 0,
  })

  const { user, signIn } = useAuth()
  const router = useRouter()

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

  const clearHeaderForm = () => {
    console.log("🧹 Clearing header form for security")
    setEmail("")
    setPassword("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("🚀 === HEADER LOGIN START ===")
    console.log("📧 Email:", email)
    console.log("🔒 Password length:", password.length)

    if (!email || !password) {
      console.log("❌ Missing email or password")
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      })
      return
    }

    setIsLoggingIn(true)

    try {
      // First check MFA status before attempting login
      console.log("🔍 Checking MFA status for:", email)
      const mfaCheck = await checkUserMfaStatus(email)
      console.log("🔍 MFA Check Result:", JSON.stringify(mfaCheck, null, 2))

      if (mfaCheck.success && mfaCheck.data?.enabled) {
        console.log("🔐 MFA IS ENABLED - Redirecting to sign-in page")
        // SECURITY: Only store email, not password
        sessionStorage.setItem("mfaEmail", email)
        sessionStorage.setItem("mfaRequired", "true")
        console.log("💾 Stored mfaEmail in sessionStorage:", email)
        console.log("💾 Stored mfaRequired in sessionStorage: true")

        // Clear the header form for security
        clearHeaderForm()

        console.log("🔄 Redirecting to /auth/sign-in?mfa=required")
        router.push("/auth/sign-in?mfa=required")
        return
      } else {
        console.log("🔓 MFA NOT ENABLED - Proceeding with normal login")
      }

      // Use the same signIn function as the sign-in page
      console.log("🔑 Calling signIn function...")
      const result = await signIn(email, password)
      console.log("🔑 SignIn Result:", JSON.stringify(result, null, 2))

      if (result.error) {
        console.log("❌ SignIn Error:", result.error)
        // Store email and error info for sign-in page
        sessionStorage.setItem("loginEmail", email)

        if (
          result.error.message.includes("Invalid login credentials") ||
          result.error.message.includes("Email not confirmed")
        ) {
          console.log("❌ Invalid credentials error")
          sessionStorage.setItem(
            "loginError",
            "The email or mobile number you entered isn't connected to an account. Find your account and log in",
          )
        } else if (
          result.error.message.includes("Invalid password") ||
          result.error.message.includes("Wrong password")
        ) {
          console.log("❌ Wrong password error")
          sessionStorage.setItem("loginError", "The password you've entered is incorrect. Forgot Password?")
        } else {
          console.log("❌ Other error:", result.error.message)
          sessionStorage.setItem("loginError", result.error.message)
        }

        // Clear the header form for security
        clearHeaderForm()

        console.log("🔄 Redirecting to sign-in page with error")
        router.push("/auth/sign-in")
        return
      }

      if (result.mfaRequired) {
        console.log("🔐 MFA REQUIRED from signIn result - Redirecting to sign-in page")
        sessionStorage.setItem("mfaEmail", email)
        sessionStorage.setItem("mfaRequired", "true")

        // Clear the header form for security
        clearHeaderForm()

        router.push("/auth/sign-in?mfa=required")
        return
      }

      if (result.data && result.data.user) {
        console.log("✅ Login successful!")
        console.log("👤 User:", result.data.user.email)
        // Login successful
        toast({
          title: "Success",
          description: "You have been logged in successfully",
        })
        // Clear form
        clearHeaderForm()
      } else {
        console.log("⚠️ Unexpected result structure:", result)
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      console.error("💥 Error stack:", error.stack)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      console.log("🏁 === HEADER LOGIN END ===")
      setIsLoggingIn(false)
    }
  }

  // Determine if the header should be fixed
  const shouldBeFixed = !scrollState.isAtTop && (scrollState.isScrollingUp || !scrollState.hasScrolledDown)

  const renderNavContent = () => (
    <>
      <div className="flex items-center">
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

        {/* Theme toggle and search moved here */}
        <button className="ml-4 mr-6" onClick={handleSearchClick}>
          <Search className="h-5 w-5 text-black dark:text-white" />
        </button>

        <div className="hidden xl:flex items-center space-x-6">
          <Link
            href="/about"
            className="font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            About
          </Link>
          <MegaMenu
            label="Features"
            sections={featuresMegaMenu.sections}
            sideSections={featuresMegaMenu.sideSections}
            promoItem={featuresMegaMenu.promoItem}
            className="font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="flex items-center">
        {!user && (
          <form onSubmit={handleLogin} className="flex items-center">
            <div className="hidden sm:flex items-center">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-40 h-[35px] mr-[11px] text-sm bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-gray-400 dark:border-gray-300 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 pl-3 pr-2"
                disabled={isLoggingIn}
                autoComplete="email"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-40 h-[35px] mr-1 text-sm bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-gray-400 dark:border-gray-300 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 px-2"
                disabled={isLoggingIn}
                autoComplete="current-password"
                required
              />
            </div>
            <AuthButton onLogin={handleLogin} isLoggingIn={isLoggingIn} />
          </form>
        )}
        {user && <AuthButton />}
      </div>
    </>
  )

  return (
    <>
      {/* Side Menu */}
      <ErrorBoundary>
        <SideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} openWithSearch={openWithSearch} />
      </ErrorBoundary>

      {/* Search Popup */}
      <SearchPopup isOpen={isSearchPopupOpen} onClose={() => setIsSearchPopupOpen(false)} />

      {/* Consistent spacer to prevent layout shifts */}
      <div className="h-14 bg-white dark:bg-gray-900"></div>

      {/* Regular header at the top of the page */}
      {scrollState.isAtTop && (
        <nav className="absolute top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-3 py-1 md:px-6 dark:text-white bg-transparent">
          {renderNavContent()}
        </nav>
      )}

      {/* Sticky header that appears when scrolling up */}
      {shouldBeFixed && (
        <nav
          className={cn(
            "fixed top-0 left-0 right-0 z-50 w-full",
            "flex items-center justify-between px-3 py-1 md:px-6 dark:text-white",
            "bg-white/5 dark:bg-black/5 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20",
            "transition-opacity duration-300",
            scrollState.isScrollingUp ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {renderNavContent()}
        </nav>
      )}

      {/* Page Content */}
      {children}
      {!user && <SignupPopup />}
    </>
  )
}
