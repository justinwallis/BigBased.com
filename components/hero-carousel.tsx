"use client"

import { useState, useEffect, useRef } from "react"
import { useResourceLoading } from "@/hooks/use-resource-loading"
import { preloadNextImages } from "@/utils/image-preloader"
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
    <div className="relative bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Big Based</h1>
          <p className="text-xl mb-8">Your platform for truth, faith, and freedom.</p>
          <a
            href="/about"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  )
}
