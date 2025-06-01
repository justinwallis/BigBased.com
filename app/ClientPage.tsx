"use client"

import type { Viewport } from "next/types"
import { viewportConfig } from "./metadata-config"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import HeroCarousel from "@/components/hero-carousel"
import { useResourceLoading } from "@/hooks/use-resource-loading"
import loadingManager from "@/utils/loading-manager"
import { HeroCarouselSkeleton, LogoMarqueeSkeleton } from "@/components/loading-fallbacks"
import { errorLogger } from "@/utils/error-logger"
import OptimizedImage from "@/components/optimized-image"
import ScrollAnimation from "@/components/scroll-animation"
import { useTheme } from "@/components/theme-provider"
import { MenuIcons } from "@/components/menu-icons"

// Add the import for LogoInfoSection at the top of the file with the other imports
import LogoInfoSection from "@/components/logo-info-section"
// Add the import for logoItems at the top of the file with the other imports
import { logoItems } from "@/data/logo-items"
// Add this import with the other imports at the top of the file
import DigitalLibrarySection from "@/components/digital-library-section"
// Import the new About section
import { AboutSection } from "@/components/about-section"
// Import the new FundraisingAndPrayerSection component
import FundraisingAndPrayerSection from "@/components/fundraising-and-prayer-section"
import InteractiveLearningCenter from "@/components/interactive-learning-center"
import EnhancedDomainMarquee from "@/components/enhanced-domain-marquee"
import { SectionObserver } from "@/components/section-observer"
import { SectionPersistenceWrapper } from "@/components/section-persistence-wrapper"

export const viewport: Viewport = viewportConfig

// Define dropdown menu content with images and interactive elements
const aboutMenuItems = [
  {
    label: "Our Mission",
    href: "/about/mission",
    image: "/mission-statement-document.png",
    description: "Learn about our core values and purpose",
  },
  {
    label: "Our Team",
    href: "/about/team",
    image: "/team-of-professionals.png",
    description: "Meet the people behind Big Based",
  },
  {
    label: "History",
    href: "/about/history",
    image: "/historical-timeline.png",
    description: "Our journey from inception to today",
  },
]

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

const revolutionMenuItems = [
  {
    label: "Manifesto",
    href: "/revolution/manifesto",
    image: "/manifesto-document.png",
    description: "The foundational principles of our movement",
  },
  {
    label: "The Movement",
    href: "/revolution/movement",
    image: "/people-gathering-rally.png",
    description: "How we're changing culture together",
  },
  {
    label: "Join Us",
    href: "/revolution/join",
    image: "/handshake-partnership.png",
    description: "Become part of the revolution",
  },
]

const featuresMenuItems = [
  {
    label: "Truth Library",
    href: "/features/library",
    image: "/digital-library.png",
    description: "Access our extensive collection of resources",
  },
  {
    label: "Community",
    href: "/features/community",
    image: "/diverse-community-gathering.png",
    description: "Connect with like-minded individuals",
  },
  {
    label: "Resources",
    href: "/features/resources",
    image: "/resource-toolkit.png",
    description: "Tools and materials to empower you",
  },
]

const partnersMenuItems = [
  {
    label: "Organizations",
    href: "/partners/organizations",
    image: "/abstract-organization-building.png",
    description: "Allied organizations in our network",
  },
  {
    label: "Companies",
    href: "/partners/companies",
    image: "/modern-business-office.png",
    description: "Corporate partners supporting our mission",
  },
  {
    label: "Become a Partner",
    href: "/partners/become",
    image: "/partnership-hands.png",
    description: "Join our growing network of allies",
  },
]

// Update the LogoMarquee component to include the logo info section

// First, add more detailed information to the logoItems array

// Update the LogoMarquee component to track hover state
const LogoMarquee = ({ logos }) => {
  const [hoveredLogo, setHoveredLogo] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  if (!logos || logos.length === 0) {
    return <LogoMarqueeSkeleton />
  }

  const handleLogoHover = (logo) => {
    setHoveredLogo(logo)
    setIsHovering(true)
  }

  const handleLogoLeave = () => {
    setIsHovering(false)
  }

  return (
    <>
      <section className="py-2 relative overflow-hidden">
        <div className="absolute left-0 w-12 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
        <div className="absolute right-0 w-12 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
        <div className="marquee-container overflow-hidden w-full" style={{ height: "40px" }}>
          <div className="marquee-content">
            {/* First set of logos */}
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="mx-2 md:mx-4 transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-60"
                onMouseEnter={() => handleLogoHover(logo)}
                onMouseLeave={handleLogoLeave}
              >
                <Link
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${logo.name} website`}
                >
                  <OptimizedImage
                    src={logo.image || "/placeholder.svg?height=28&width=85&query=logo"}
                    alt={logo.alt}
                    width={85}
                    height={28}
                    className="object-contain h-5 sm:h-6 md:h-7 image-fade-in"
                    fallbackSrc="/placeholder.svg?key=4zqxa"
                  />
                </Link>
              </div>
            ))}
            {/* Duplicate set for seamless looping */}
            {logos.map((logo) => (
              <div
                key={`dup-${logo.id}`}
                className="mx-2 md:mx-4 transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-60"
                onMouseEnter={() => handleLogoHover(logo)}
                onMouseLeave={handleLogoLeave}
              >
                <Link
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${logo.name} website`}
                >
                  <OptimizedImage
                    src={logo.image || "/placeholder.svg?height=28&width=85&query=logo"}
                    alt={logo.alt}
                    width={85}
                    height={28}
                    className="object-contain h-5 sm:h-6 md:h-7 image-fade-in"
                    fallbackSrc="/placeholder.svg?key=4ux7r"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add the LogoInfoSection component below the marquee */}
      <LogoInfoSection selectedLogo={hoveredLogo} isHovering={isHovering} />
    </>
  )
}

// Mock function for prefetching logo data (replace with actual data fetching)
const prefetchLogoData = async () => {
  // Simulate an API call or data fetching process
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return logoItems
}

const LazyHeroCarousel = () => {
  return (
    <Suspense fallback={<HeroCarouselSkeleton />}>
      <HeroCarousel />
    </Suspense>
  )
}

export default function ClientPage() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [openWithSearch, setOpenWithSearch] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const [contentLoaded, setContentLoaded] = useState(false)
  const [logos, setLogos] = useState(logoItems)
  const [logosLoaded, setLogosLoaded] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  // Register main page component with loading manager
  const { markLoaded } = useResourceLoading("main-page", 3)

  // Register and fetch logo data
  useEffect(() => {
    const fetchData = async () => {
      try {
        loadingManager.registerResource("logo-data", 1)
        loadingManager.startLoading("logo-data")

        const data = await prefetchLogoData()
        setLogos(data)
        setLogosLoaded(true)
        loadingManager.resourceLoaded("logo-data")
      } catch (error) {
        errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
          component: "Home",
          function: "fetchData",
        })
        // Still mark as loaded and use default data
        setLogosLoaded(true)
        loadingManager.resourceError("logo-data")
      }
    }

    fetchData()
  }, [])

  // Mark main page as loaded when all critical components are mounted
  useEffect(() => {
    markLoaded()
  }, [markLoaded])

  // Remove the initial preloader once React is hydrated and content is ready
  useEffect(() => {
    try {
      // Mark content as loaded
      setContentLoaded(true)

      // Remove the initial preloader after a short delay
      const timer = setTimeout(() => {
        const preloader = window.initialPreloader
        if (preloader && preloader.parentNode) {
          // Fade out the preloader
          preloader.style.opacity = "0"
          preloader.style.transition = "opacity 0.8s ease-in-out"

          // Remove from DOM after transition
          setTimeout(() => {
            if (preloader && preloader.parentNode) {
              preloader.parentNode.removeChild(preloader)
            }
          }, 800)
        }
      }, 500) // Short delay to ensure smooth transition

      return () => clearTimeout(timer)
    } catch (error) {
      errorLogger.logError(error instanceof Error ? error : new Error(String(error)), {
        component: "Home",
        function: "removePreloader",
      })
      // Still mark content as loaded even if there's an error
      setContentLoaded(true)
    }
  }, [])

  const handleSearchClick = () => {
    setIsSearchPopupOpen(true)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Hide content until loaded to prevent flash
  if (typeof window !== "undefined" && !contentLoaded) {
    return null
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <ScrollAnimation animation="fadeInUp" delay={0.2}>
            <p className="text-lg md:text-xl mb-4 text-center">Big Based is not just a Project, but</p>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={0.4}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6">Answer to Madness.</h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={0.6}>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-center mb-8">
              Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth,
              faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeInUp" delay={0.8}>
            <div className="flex justify-center">
              <a
                href="/transform"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                How We Transform →
              </a>
            </div>
          </ScrollAnimation>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/digitalcross.png"
            alt="Digital Cross"
            className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl digital-cross-pulse"
          />
        </div>
      </section>

      {/* Domain Marquee */}
      <SectionPersistenceWrapper sectionId="domain-marquee">
        <SectionObserver>
          <EnhancedDomainMarquee />
        </SectionObserver>
      </SectionPersistenceWrapper>

      {/* About Section */}
      <SectionPersistenceWrapper sectionId="about-section">
        <SectionObserver>
          <AboutSection />
        </SectionObserver>
      </SectionPersistenceWrapper>

      {/* Logo Info Section */}
      <SectionPersistenceWrapper sectionId="logo-info-section">
        <SectionObserver>
          <LogoInfoSection />
        </SectionObserver>
      </SectionPersistenceWrapper>

      {/* Digital Library Section */}
      <SectionPersistenceWrapper sectionId="digital-library-section">
        <SectionObserver>
          <DigitalLibrarySection />
        </SectionObserver>
      </SectionPersistenceWrapper>

      {/* Interactive Learning Center */}
      <SectionPersistenceWrapper sectionId="interactive-learning-center">
        <SectionObserver>
          <InteractiveLearningCenter />
        </SectionObserver>
      </SectionPersistenceWrapper>

      {/* Fundraising and Prayer Section */}
      <SectionPersistenceWrapper sectionId="fundraising-section">
        <SectionObserver>
          <FundraisingAndPrayerSection />
        </SectionObserver>
      </SectionPersistenceWrapper>
    </div>
  )
}
