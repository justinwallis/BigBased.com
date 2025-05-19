"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useResourceLoading } from "@/hooks/use-resource-loading"
import { preloadNextImages } from "@/utils/image-preloader"
import OptimizedImage from "./optimized-image"
import { useImagePreloader } from "@/hooks/use-image-preloader"

// Add text shadow styles - DOUBLED intensity
const textShadowStyles = `
  .text-shadow-container h2 {
    text-shadow: 0 2px 6px rgba(255, 255, 255, 0.6), 0 0 2px rgba(255, 255, 255, 0.8);
  }
  
  .text-shadow-container p {
    text-shadow: 0 1px 4px rgba(255, 255, 255, 0.5), 0 0 2px rgba(255, 255, 255, 0.7);
  }
  
  .text-shadow-container a {
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.5), 0 0 2px rgba(255, 255, 255, 0.7);
  }
  
  .dark .text-shadow-container h2 {
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.9);
  }
  
  .dark .text-shadow-container p {
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7), 0 0 2px rgba(0, 0, 0, 0.8);
  }
  
  .dark .text-shadow-container a {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7), 0 0 2px rgba(0, 0, 0, 0.8);
  }
`

// Define the hero section data
const heroSections = [
  {
    id: 1,
    subtitle: "Big Based is not just a Project, but",
    title: "Answer to Madness.",
    description:
      "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform.",
    ctaText: "How We Transform",
    ctaLink: "/transform",
    image: "/DoveCross610h.png",
    imageAlt: "Dove with spread wings against a cross background",
  },
  {
    id: 2,
    subtitle: "Exposing & Dismantling",
    title: "Cultural Decay.",
    description:
      "Targets and deconstructs cringe-worthy elements in society, including cultural decay, legacy media manipulation, and revisionist history, weaking cringe media.",
    ctaText: "More about Big Cringe",
    ctaLink: "/big-cringe",
    image: "/placeholder.svg?key=vbrti",
    imageAlt: "Two doors showing cultural contrast",
  },
  {
    id: 3,
    subtitle: "Reclaiming & Rebuilding",
    title: "Digital Sovereignty.",
    description:
      "Take back control of your digital life. We provide tools and knowledge to break free from Big Tech surveillance, censorship, and manipulation while building alternative platforms rooted in freedom.",
    ctaText: "Explore Digital Freedom",
    ctaLink: "/digital-freedom",
    image: "/placeholder.svg?key=uo2ww",
    imageAlt: "Breaking free from digital chains",
  },
  {
    id: 4,
    subtitle: "Preserving & Protecting",
    title: "Truth Archives.",
    description:
      "Our comprehensive library documents and preserves critical information that's being systematically erased from the internet. Access thousands of censored studies, articles, and historical records.",
    ctaText: "Access the Archives",
    ctaLink: "/archives",
    image: "/placeholder.svg?key=pjjug",
    imageAlt: "Archive of knowledge",
  },
  {
    id: 5,
    subtitle: "Building & Connecting",
    title: "Parallel Economy.",
    description:
      "Join a growing network of freedom-minded businesses, creators, and consumers building an alternative economic ecosystem based on shared values and mutual support.",
    ctaText: "Join the Network",
    ctaLink: "/network",
    image: "/placeholder.svg?key=rpllp",
    imageAlt: "Network of connected people",
  },
]

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(1) // Start at index 1 (real first slide)
  const [transitioning, setTransitioning] = useState(false)
  const [badgeHovered, setBadgeHovered] = useState(false)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
  const carouselRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const sectionRef = useRef(null)
  const autoplayIntervalRef = useRef(null)
  const imageRefs = useRef({})

  // Preload all hero images using the useImageLoading hook
  const imageKeys = heroSections.map((section, index) => `hero-image-${index}`)
  const imagePaths = heroSections.map((section) => section.image)
  useImagePreloader(imageKeys, imagePaths, 1)

  // Register the carousel component with the loading manager
  const { markLoaded } = useResourceLoading("hero-carousel", 2)

  // Mark the carousel as loaded when it's mounted
  useEffect(() => {
    markLoaded()
  }, [markLoaded])

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Create extended array with cloned slides for infinite scrolling
  const extendedSections = [
    // Clone the last slide and put it at the beginning
    { ...heroSections[heroSections.length - 1], id: "clone-start" },
    // Original slides
    ...heroSections,
    // Clone the first slide and put it at the end
    { ...heroSections[0], id: "clone-end" },
  ]

  const totalSlides = extendedSections.length

  // Function to handle the infinite scroll logic
  const handleInfiniteScroll = () => {
    if (!carouselRef.current) return

    // If we're at the cloned last slide (position 0)
    if (activeIndex === 0) {
      // After transition completes, immediately jump to the real last slide without animation
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none"
          setActiveIndex(heroSections.length) // Jump to real last slide

          // Re-enable transitions after the jump
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "transform 1.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
            }
          }, 50)
        }
      }, 1800)
    }

    // If we're at the cloned first slide (last position)
    else if (activeIndex === totalSlides - 1) {
      // After transition completes, immediately jump to the real first slide without animation
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none"
          setActiveIndex(1) // Jump to real first slide

          // Re-enable transitions after the jump
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "transform 1.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
            }
          }, 50)
        }
      }, 1800)
    }
  }

  // Function to advance to the next slide
  const goToNext = () => {
    if (transitioning) return
    setTransitioning(true)
    setActiveIndex((prev) => {
      // If we're at the last real slide, go to the clone of the first slide
      if (prev === heroSections.length) {
        return totalSlides - 1
      }
      // Otherwise, just go to the next slide
      return prev + 1
    })
    setTimeout(() => setTransitioning(false), 1800) // Longer transition time
  }

  // Function to go to the previous slide
  const goToPrevious = () => {
    if (transitioning) return
    setTransitioning(true)
    setActiveIndex((prev) => {
      // If we're at the first real slide, go to the clone of the last slide
      if (prev === 1) {
        return 0
      }
      // Otherwise, just go to the previous slide
      return prev - 1
    })
    setTimeout(() => setTransitioning(false), 1800)
  }

  // Touch event handlers for swipe functionality
  const handleTouchStart = (event) => {
    setAutoplayPaused(true) // Pause autoplay on touch
    if (event && event.touches && event.touches[0]) {
      touchStartX.current = event.touches[0].clientX
    }
  }

  const handleTouchMove = (event) => {
    if (event && event.touches && event.touches[0]) {
      touchEndX.current = event.touches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50

    // Calculate swipe distance
    const swipeDistance = touchEndX.current - touchStartX.current

    // If the swipe was long enough and not during a transition
    if (Math.abs(swipeDistance) > minSwipeDistance && !transitioning) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous slide
        goToPrevious()
      } else {
        // Swipe left - go to next slide
        goToNext()
      }
    }

    // Resume autoplay after a delay
    setTimeout(() => {
      setAutoplayPaused(false)
    }, 5000)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keyboard events if the carousel is in view
      if (sectionRef.current && isElementInViewport(sectionRef.current)) {
        if (event.key === "ArrowLeft") {
          setAutoplayPaused(true)
          goToPrevious()
          // Resume autoplay after a delay
          setTimeout(() => {
            setAutoplayPaused(false)
          }, 5000)
        } else if (event.key === "ArrowRight") {
          setAutoplayPaused(true)
          goToNext()
          // Resume autoplay after a delay
          setTimeout(() => {
            setAutoplayPaused(false)
          }, 5000)
        }
      }
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [transitioning]) // Only re-add the listener if transitioning state changes

  // Call handleInfiniteScroll whenever activeIndex changes
  useEffect(() => {
    handleInfiniteScroll()
  }, [activeIndex])

  // Auto-rotate through hero sections - fixed to not depend on activeIndex
  useEffect(() => {
    // Clear any existing interval when component mounts or autoplayPaused changes
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }

    // Only set up the interval if autoplay is not paused
    if (!autoplayPaused) {
      autoplayIntervalRef.current = setInterval(() => {
        if (!transitioning) {
          goToNext()
        }
      }, 7000) // Change slide every 7 seconds (slower pace)
    }

    // Clean up the interval when component unmounts or dependencies change
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
    }
  }, [autoplayPaused, transitioning]) // Only recreate interval if autoplay state or transitioning state changes

  // Handle visibility change to pause/resume autoplay
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAutoplayPaused(true)
      } else {
        setAutoplayPaused(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Handle theme changes for the America First badge
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark")
      const el = document.querySelector('[data-theme-style="true"]')
      if (el) {
        el.setAttribute(
          "style",
          `padding: 16px 12px 8px 12px; background: radial-gradient(circle at center, ${
            isDark ? "rgba(30,41,59,0.05)" : "rgba(255,255,255,0.05)"
          } 30%, ${isDark ? "rgba(30,41,59,0)" : "rgba(255,255,255,0)"} 70%);`,
        )
      }
    }

    // Set initial theme
    handleThemeChange()

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  // America First Badge - Updated with gradient shadows for light/dark mode

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setAutoplayPaused(true)
  }

  const handleMouseLeave = () => {
    setAutoplayPaused(false)
  }

  // Preload hero images
  useEffect(() => {
    try {
      // Extract all image paths
      const imagePaths = heroSections.map((section) => section.image)

      // Preload next images based on current index
      preloadNextImages(activeIndex - 1, imagePaths, 2)

      // Preload next images when active index changes
      const realIndex =
        activeIndex === 0 ? heroSections.length - 1 : activeIndex === totalSlides - 1 ? 0 : activeIndex - 1
      preloadNextImages(realIndex, imagePaths, 2)
    } catch (error) {
      console.error("Error preloading hero images:", error)
    }
  }, [activeIndex, totalSlides])

  // Function to handle image load and store dimensions
  const handleImageLoad = (id, e) => {
    if (e && e.target) {
      const { naturalWidth, naturalHeight } = e.target
      imageRefs.current[id] = { width: naturalWidth, height: naturalHeight }
    }
  }

  // Calculate optimal image display size based on container and image dimensions
  const getOptimalImageSize = (imageId, containerWidth, containerHeight) => {
    const imageDimensions = imageRefs.current[imageId]
    if (!imageDimensions) return { width: "auto", height: "auto", maxHeight: "610px" }

    const { width, height } = imageDimensions
    const aspectRatio = width / height

    // For mobile screens
    if (windowWidth < 768) {
      return {
        width: "auto",
        height: "auto",
        maxHeight: "300px",
        maxWidth: "100%",
        objectFit: "contain",
        margin: "20px 0",
      }
    }

    // For larger screens
    if (aspectRatio > 1) {
      // Landscape image
      return {
        width: "auto",
        height: Math.min(610, height),
        maxWidth: "100%",
        objectFit: "contain",
      }
    } else {
      // Portrait image
      return {
        height: Math.min(610, height),
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
      }
    }
  }

  // Add style tag for text shadows
  useEffect(() => {
    // Create style element if it doesn't exist
    if (!document.getElementById("hero-text-shadow-styles")) {
      const styleEl = document.createElement("style")
      styleEl.id = "hero-text-shadow-styles"
      styleEl.innerHTML = textShadowStyles
      document.head.appendChild(styleEl)
    }

    // Clean up on unmount
    return () => {
      const styleEl = document.getElementById("hero-text-shadow-styles")
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible py-3 px-4 md:px-8 bg-white dark:bg-gray-900 transition-colors duration-300"
      style={{
        height: windowWidth < 768 ? "auto" : "610px",
        minHeight: windowWidth < 768 ? "650px" : "610px",
        marginTop: "0", // Remove negative margin
        paddingTop: "80px", // Add padding to create space for the header
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0} // Make the section focusable for keyboard navigation
      aria-roledescription="carousel"
      aria-label="Hero content carousel"
    >
      {/* Left and Right Edge Fade Effects - Light Mode Only */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)",
          height: "calc(130% - 17px)", // Reduced height by 17px (14px + 3px)
          top: "-25%", // Keep the same top position to maintain upward extension
          bottom: "auto", // Override the bottom: 0 from the className
        }}
      ></div>
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)",
          height: "calc(130% - 17px)", // Reduced height by 17px (14px + 3px)
          top: "-25%", // Keep the same top position to maintain upward extension
          bottom: "auto", // Override the bottom: 0 from the className
        }}
      ></div>

      {/* Dark mode fade effects - Updated to match dark:bg-gray-900 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(to right, rgba(17,24,39,1) 0%, rgba(17,24,39,0.8) 40%, rgba(17,24,39,0) 100%)",
          height: "calc(130% - 17px)", // Reduced height by 17px (14px + 3px)
          top: "-25%", // Keep the same top position to maintain upward extension
          bottom: "auto", // Override the bottom: 0 from the className
        }}
      ></div>
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(to left, rgba(17,24,39,1) 0%, rgba(17,24,39,0.8) 40%, rgba(17,24,39,0) 100%)",
          height: "calc(130% - 17px)", // Reduced height by 17px (14px + 3px)
          top: "-25%", // Keep the same top position to maintain upward extension
          bottom: "auto", // Override the bottom: 0 from the className
        }}
      ></div>

      {/* Navigation Arrows - Adjusted positions */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 transform -translate-y-1/2 z-30 transition-transform duration-300 hover:scale-110 focus:outline-none p-3"
        style={{
          filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
          left: "2px", // -3px + 5px = 2px from left edge
        }}
        aria-label="Previous slide"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leftarrow-cZusycTk5U0qpLdTilVQ4PmMac7R9k.png"
          alt="Previous"
          width="8"
          height="8"
          className="block dark:hidden"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leftarrowwhite-3iCFk4QxkyUcDWYzwZDCy6avFMGXHZ.png"
          alt="Previous"
          width="8"
          height="8"
          className="hidden dark:block"
        />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 transform -translate-y-1/2 z-30 transition-transform duration-300 hover:scale-110 focus:outline-none p-3"
        style={{
          filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
          right: "37px", // 45px - 8px = 37px from right edge
        }}
        aria-label="Next slide"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rightarrow-lh3ALnXSTKUAzHVWPUW6RXicZyaB84.png"
          alt="Next"
          width="8"
          height="8"
          className="block dark:hidden"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rightarrowwhite-KFDD9v6NMb8xQaVTDUhbHCBf6c0gTH.png"
          alt="Next"
          width="8"
          height="8"
          className="hidden dark:block"
        />
      </button>

      {/* America First Badge */}
      <div
        className={`absolute bottom-8 right-12 z-20 flex flex-col items-start transition-all duration-300 ${
          badgeHovered ? "scale-110" : ""
        } shadow-lg rounded-md`}
        style={{
          padding: "16px 12px 8px 12px",
          background: "radial-gradient(circle at center, rgba(0,0,0,0.03) 30%, rgba(0,0,0,0.01) 70%)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        data-theme-style="true"
        onMouseEnter={() => {
          setBadgeHovered(true)
          // Update gradient based on theme
          const isDark = document.documentElement.classList.contains("dark")
          const el = document.querySelector('[data-theme-style="true"]')
          if (el) {
            el.setAttribute(
              "style",
              `padding: 16px 12px 8px 12px; background: radial-gradient(circle at center, ${
                isDark ? "rgba(30,41,59,0.1)" : "rgba(0,0,0,0.03)"
              } 30%, ${isDark ? "rgba(30,41,59,0.05)" : "rgba(0,0,0,0.01)"} 70%); 
        box-shadow: ${isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.08)"};
        border-radius: 0.375rem;`,
            )
          }
        }}
        onMouseLeave={() => {
          setBadgeHovered(false)
          // Update gradient based on theme
          const isDark = document.documentElement.classList.contains("dark")
          const el = document.querySelector('[data-theme-style="true"]')
          if (el) {
            el.setAttribute(
              "style",
              `padding: 16px 12px 8px 12px; background: radial-gradient(circle at center, ${
                isDark ? "rgba(30,41,59,0.1)" : "rgba(0,0,0,0.03)"
              } 30%, ${isDark ? "rgba(30,41,59,0.05)" : "rgba(0,0,0,0.01)"} 70%);
        box-shadow: ${isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.08)"};
        border-radius: 0.375rem;`,
            )
          }
        }}
      >
        <OptimizedImage
          src="/AmericaFlag.png"
          alt="American flag"
          width={30}
          height={18}
          className="mb-2"
          fallbackSrc="/AmericaFlag.png"
        />
        <div className="text-[10px] text-gray-800 dark:text-gray-100">
          <p className="font-bold">AMERICA FIRST,</p>
          <p>UNCENSORED CHRISTIAN</p>
          <p>COMPANY</p>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={carouselRef}
        className="h-full w-full flex transition-transform duration-1800 ease-in-out"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: "transform 1.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)", // Slower, more elegant easing
        }}
        aria-live="polite"
      >
        {/* Render all slides in a row, including cloned slides */}
        {extendedSections.map((hero, index) => {
          const slideId = `slide-${hero.id}-${index}`
          return (
            <div
              key={slideId}
              className="h-full w-full flex-shrink-0 flex items-center px-4 md:px-8 bg-white dark:bg-gray-900 transition-colors duration-300"
              aria-hidden={activeIndex !== index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
            >
              <div className="flex w-full h-full items-center flex-col md:flex-row">
                {/* Text Section - 1/3 width on desktop, full width on mobile */}
                <div
                  className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0 relative z-20 text-shadow-container"
                  style={{ marginTop: windowWidth < 768 ? "-80px" : "-40px" }}
                >
                  <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">{hero.subtitle}</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{hero.title}</h2>
                  <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">{hero.description}</p>
                  <Link
                    href={hero.ctaLink}
                    className="flex items-center font-medium text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {hero.ctaText} <span className="ml-2">→</span>
                  </Link>
                </div>

                {/* Image Section - 2/3 width on desktop, full width on mobile */}
                <div className="w-full md:w-2/3 h-full flex items-center justify-center py-4 md:py-0 relative z-10">
                  <div
                    className="relative w-full flex items-center justify-center"
                    style={{
                      minHeight: windowWidth < 768 ? "300px" : "610px",
                      height: "610px",
                      marginTop: "-80px", // Move images up to create "jumping off" effect
                    }}
                  >
                    <OptimizedImage
                      src={hero.image}
                      alt={hero.imageAlt}
                      width={800}
                      height={610}
                      className="object-contain transition-all duration-300"
                      style={{
                        ...getOptimalImageSize(
                          slideId,
                          windowWidth < 768 ? windowWidth : windowWidth * 0.66,
                          windowWidth < 768 ? 300 : 610,
                        ),
                        maxHeight: "610px", // Ensure consistent height
                        position: hero.image === "/DoveCross610h.png" ? "relative" : "static",
                        zIndex: hero.image === "/DoveCross610h.png" ? "1" : "auto",
                        transform: hero.image === "/DoveCross610h.png" ? "scale(1.15)" : "none", // Make the dove image slightly larger
                      }}
                      priority={index === activeIndex}
                      onLoad={(e) => handleImageLoad(slideId, e)}
                      fallbackSrc={`/placeholder.svg?height=610&width=800&query=${encodeURIComponent(hero.imageAlt || "hero")}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
