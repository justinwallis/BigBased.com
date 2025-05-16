"use client"

import type { Viewport } from "next/types"
import { viewportConfig } from "./metadata-config"
import { useState, useEffect, Suspense } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import SideMenu from "@/components/side-menu"
import HeroCarousel from "@/components/hero-carousel"
import EnhancedDropdownMenu from "@/components/enhanced-dropdown-menu"
import { useResourceLoading } from "@/hooks/use-resource-loading"
import loadingManager from "@/utils/loading-manager"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  HeroCarouselSkeleton,
  LogoMarqueeSkeleton,
  ContentSectionSkeleton,
  DomainMarqueeSkeleton,
  WebsiteShowcaseSkeleton,
} from "@/components/loading-fallbacks"
import { errorLogger } from "@/utils/error-logger"
import { ThemeToggle } from "@/components/theme-toggle"
import OptimizedImage from "@/components/optimized-image"
import FloatingNavigation from "@/components/floating-navigation"
import ScrollAnimation from "@/components/scroll-animation"
import { useTheme } from "@/components/theme-provider"

// Add the import for LogoInfoSection at the top of the file with the other imports
import LogoInfoSection from "@/components/logo-info-section"
// Add the import for logoItems at the top of the file with the other imports
import { logoItems } from "@/data/logo-items"
// Add this import with the other imports at the top of the file
import DigitalLibrarySection from "@/components/digital-library-section"
// Import the new vertical domain scroller
import VerticalDomainScroller from "@/components/vertical-domain-scroller"
// Import the new About section
import { AboutSection } from "@/components/about-section"
// Add the import for SitemapContainer at the top of the file with the other imports
import SitemapContainer from "@/components/sitemap-container"
// Import the new website showcase component
import WebsiteShowcase from "@/components/website-showcase"
// Import the new FundraisingAndPrayerSection component
import FundraisingAndPrayerSection from "@/components/fundraising-and-prayer-section"
// Import CallToAction component - Fixed: Changed from named import to default import
import CallToAction from "@/components/call-to-action"
// Import the new XShareWidget component
import XShareWidget from "@/components/x-share-widget"
// Import the new MediaVotingPlatform component
import MediaVotingPlatform from "@/components/media-voting-platform"
// Import the new LiveBasedIndexModule component
import LiveBasedIndexModule from "@/components/live-based-index-module"
// Add the import for BasedProfileTease at the top of the file with the other imports
import BasedProfileTease from "@/components/based-profile-tease"
// Import the BBLogo component
import BBLogo from "@/components/bb-logo"
// Make sure to add the import at the top of the file:
import BasedQuiz from "@/components/based-quiz"

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
      <section className="py-2 border-t border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
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
  const { theme } = useTheme()

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
    setOpenWithSearch(true)
    setIsSideMenuOpen(true)
  }

  // Hide content until loaded to prevent flash
  if (typeof window !== "undefined" && !contentLoaded) {
    return null
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-gray-900">
      {/* Side Menu */}
      <ErrorBoundary>
        <SideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} openWithSearch={openWithSearch} />
      </ErrorBoundary>

      {/* Floating Dot Navigation */}
      <FloatingNavigation />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 md:px-16 relative z-50 dark:text-white">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className={`font-bold text-2xl transition-transform duration-300 ${logoHovered ? "scale-110" : ""} flex items-center`}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div className="relative w-16 h-16 transition-all duration-300 flex items-center justify-center">
              <BBLogo size="lg" />
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
            >
              About
            </Link>
            <EnhancedDropdownMenu label="Revolution" items={revolutionMenuItems} />
            <EnhancedDropdownMenu label="Features" items={featuresMenuItems} />
            <EnhancedDropdownMenu label="Partners" items={partnersMenuItems} />
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
          <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-md">
            Join
          </button>
        </div>
      </nav>

      {/* Hero Carousel */}
      <section id="hero">
        <LazyHeroCarousel />
      </section>

      {/* Enhanced Logos Marquee Section with Detailed Tooltips and Links */}
      <section id="partners-marquee">
        <ScrollAnimation animation="fade-up">
          <ErrorBoundary>
            <Suspense fallback={<LogoMarqueeSkeleton />}>
              {logosLoaded ? <LogoMarquee logos={logos} /> : <LogoMarqueeSkeleton />}
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Add the new FundraisingAndPrayerSection component */}
      <section id="fundraising">
        <ScrollAnimation animation="fade-up">
          <ErrorBoundary>
            <FundraisingAndPrayerSection />
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Add the new DigitalLibrarySection component */}
      <section id="library">
        <ScrollAnimation animation="fade-up" delay={100}>
          <ErrorBoundary>
            <Suspense fallback={<ContentSectionSkeleton />}>
              <DigitalLibrarySection />
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Revolution Section - Extremely simplified */}
      <section id="revolution">
        <ScrollAnimation animation="fade-up" delay={200}>
          <ErrorBoundary>
            <Suspense fallback={<ContentSectionSkeleton />}>
              <section className="py-24 px-8 md:px-16 bg-black text-white text-center relative">
                {/* Background Image with 10% opacity */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: "url('/BckgTech.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.1,
                  }}
                ></div>

                {/* Content with relative positioning to appear above the background */}
                <div className="relative z-10">
                  <p className="mb-8">The Revolution</p>
                  <h2 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight mb-12">
                    Convergence of Political, Religious, and Technological Transformation Shaping our Future.
                  </h2>
                  <p className="max-w-2xl mx-auto">
                    Big Based represents the convergence of Political, Religious, and Technological transformation
                    shaping our future. It's a bold initiative to reclaim control, decentralize power, and align
                    technology with faith and freedom. As the world reaches a tipping point, Big Based offers the tools
                    and vision to lead this cultural and digital renaissance
                  </p>
                </div>
              </section>
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* About Big Based Section */}
      <section id="about">
        <ScrollAnimation animation="fade-up" delay={300}>
          <ErrorBoundary>
            <Suspense fallback={<ContentSectionSkeleton />}>
              <AboutSection />
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Add the new Media Voting Platform component */}
      <section id="media">
        <ScrollAnimation animation="fade-up" delay={400}>
          <ErrorBoundary>
            <Suspense fallback={<ContentSectionSkeleton />}>
              <MediaVotingPlatform />
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Add the new Live Based Index Module component */}
      <ScrollAnimation animation="fade-up" delay={500}>
        <ErrorBoundary>
          <Suspense fallback={<ContentSectionSkeleton />}>
            <LiveBasedIndexModule />
          </Suspense>
        </ErrorBoundary>
      </ScrollAnimation>

      {/* Add the new Website Showcase section above the Domain Collection */}
      <section id="website-showcase">
        <ScrollAnimation animation="fade-up" delay={600}>
          <ErrorBoundary>
            <Suspense fallback={<WebsiteShowcaseSkeleton />}>
              <WebsiteShowcase />
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Share & Connect on X */}
      <section id="x-share-widget">
        <ScrollAnimation animation="fade-up" delay={700}>
          <ErrorBoundary>
            <XShareWidget />
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Domain Scroller - Now positioned directly above the footer */}
      <section id="domains">
        <ScrollAnimation animation="fade-up" delay={800}>
          <ErrorBoundary>
            <Suspense fallback={<DomainMarqueeSkeleton />}>
              <VerticalDomainScroller />
            </Suspense>
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Based Profile Tease Section */}
      <ScrollAnimation animation="fade-up" delay={900}>
        <ErrorBoundary>
          <BasedProfileTease />
        </ErrorBoundary>
      </ScrollAnimation>

      {/* Based Quiz Section */}
      <section id="based-quiz">
        <ScrollAnimation animation="fade-up" delay={1000}>
          <ErrorBoundary>
            <BasedQuiz />
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      {/* Add the SitemapContainer component here */}
      <ScrollAnimation animation="fade-up" delay={1100}>
        <ErrorBoundary>
          <SitemapContainer />
        </ErrorBoundary>
      </ScrollAnimation>

      {/* Call to Action Section - Moved to the end, right above the footer */}
      <section id="call-to-action" className="pb-10 mb-5">
        <ScrollAnimation animation="fade-up" delay={1200}>
          <ErrorBoundary>
            <CallToAction />
          </ErrorBoundary>
        </ScrollAnimation>
      </section>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </main>
  )
}
