"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Globe,
  Shield,
  Zap,
  Users,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Check,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { useTheme } from "next-themes"
import { VideoPlayer } from "./video-player"
import { useMediaQuery } from "@/hooks/use-mobile"

interface LearningModule {
  id: string
  title: string
  icon: React.ReactNode
  videoSrc: string
  videoTitle: string
  videoPoster?: string
  description: string
  keyPoints: string[]
  resources: Array<{ title: string; url: string }>
  estimatedTime?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
}

interface UserProgress {
  [moduleId: string]: {
    completed: boolean
    bookmarked: boolean
    lastViewed: string
    feedback?: "helpful" | "not-helpful"
  }
}

export function InteractiveLearningCenter() {
  const [activeModule, setActiveModule] = useState<string>("mission")
  const [userProgress, setUserProgress] = useState<UserProgress>({})
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Simulated module progress data
  const initialProgress: UserProgress = {
    mission: { completed: true, bookmarked: false, lastViewed: "2023-05-10" },
    resources: { completed: false, bookmarked: true, lastViewed: "2023-05-12" },
    technology: { completed: false, bookmarked: false, lastViewed: "2023-05-15" },
    domains: { completed: false, bookmarked: false, lastViewed: "" },
    community: { completed: false, bookmarked: false, lastViewed: "" },
  }

  useEffect(() => {
    // Simulate loading user progress from storage/API
    const loadProgress = () => {
      const savedProgress = localStorage.getItem("learning-progress")
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress))
      } else {
        setUserProgress(initialProgress)
      }
    }

    loadProgress()
  }, [])

  useEffect(() => {
    // Save progress when it changes
    if (Object.keys(userProgress).length > 0) {
      localStorage.setItem("learning-progress", JSON.stringify(userProgress))
    }
  }, [userProgress])

  const handleModuleChange = (moduleId: string) => {
    setIsLoading(true)

    // Simulate loading delay for content change
    setTimeout(() => {
      setActiveModule(moduleId)
      setShowFeedback(false)

      // Update last viewed timestamp
      setUserProgress((prev) => ({
        ...prev,
        [moduleId]: {
          ...(prev[moduleId] || { completed: false, bookmarked: false }),
          lastViewed: new Date().toISOString().split("T")[0],
        },
      }))

      setIsLoading(false)

      // Scroll to top of content on mobile
      if (isMobile && contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 300)
  }

  const toggleBookmark = (moduleId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || { completed: false, lastViewed: "" }),
        bookmarked: !(prev[moduleId]?.bookmarked || false),
      },
    }))
  }

  const markAsCompleted = (moduleId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || { bookmarked: false, lastViewed: "" }),
        completed: true,
      },
    }))
    setShowFeedback(true)
  }

  const provideFeedback = (moduleId: string, type: "helpful" | "not-helpful") => {
    setUserProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || { completed: true, bookmarked: false, lastViewed: "" }),
        feedback: type,
      },
    }))
    setShowFeedback(false)
  }

  const learningModules: LearningModule[] = [
    {
      id: "mission",
      title: "Our Mission",
      icon: <Shield size={20} />,
      videoSrc: "https://example.com/videos/mission.mp4",
      videoTitle: "The Big Based Mission",
      videoPoster: "/mission-video-thumbnail.png",
      description:
        "Big Based is committed to restoring truth, faith, and freedom in a world increasingly dominated by deception and control. We aim to empower individuals with knowledge and tools to reclaim their digital sovereignty.",
      keyPoints: [
        "Promoting digital sovereignty and independence",
        "Providing educational resources on critical topics",
        "Building a community of like-minded individuals",
        "Developing technology solutions for privacy and security",
      ],
      resources: [
        { title: "Mission Statement", url: "#" },
        { title: "Founding Principles", url: "#" },
      ],
      estimatedTime: "5 min",
      difficulty: "beginner",
    },
    {
      id: "resources",
      title: "Educational Resources",
      icon: <BookOpen size={20} />,
      videoSrc: "https://example.com/videos/resources.mp4",
      videoTitle: "Educational Resources Overview",
      videoPoster: "/educational-resources-thumbnail.png",
      description:
        "Access our extensive library of books, articles, and guides covering topics from constitutional principles to digital privacy. Our curated resources help you navigate the complex landscape of today's challenges.",
      keyPoints: [
        "Comprehensive digital library of books and articles",
        "Guides on privacy, security, and digital independence",
        "Historical documents and constitutional resources",
        "Regular updates with new content and research",
      ],
      resources: [
        { title: "Digital Library", url: "#" },
        { title: "Research Papers", url: "#" },
      ],
      estimatedTime: "8 min",
      difficulty: "intermediate",
    },
    {
      id: "technology",
      title: "Technology Solutions",
      icon: <Zap size={20} />,
      videoSrc: "https://example.com/videos/technology.mp4",
      videoTitle: "Technology Solutions for Digital Independence",
      videoPoster: "/placeholder-oolgw.png",
      description:
        "We develop and promote technologies that enhance privacy, security, and independence from centralized control. Our tools and platforms are designed to give you back control over your digital life.",
      keyPoints: [
        "Privacy-focused communication tools",
        "Decentralized platforms and services",
        "Open-source software development",
        "Security auditing and best practices",
      ],
      resources: [
        { title: "Technology Stack", url: "#" },
        { title: "Security Guidelines", url: "#" },
      ],
      estimatedTime: "12 min",
      difficulty: "advanced",
    },
    {
      id: "domains",
      title: "Domain Collection",
      icon: <Globe size={20} />,
      videoSrc: "https://example.com/videos/domains.mp4",
      videoTitle: "Strategic Domain Collection",
      videoPoster: "/domain-collection-thumbnail.png",
      description:
        "Our extensive collection of premium domains represents strategic digital real estate for the parallel economy. These domains serve as the foundation for building independent platforms and services.",
      keyPoints: [
        "Premium domain portfolio for strategic initiatives",
        "Domain management and development services",
        "Digital real estate investment opportunities",
        "Building blocks for the parallel economy",
      ],
      resources: [
        { title: "Domain Strategy", url: "#" },
        { title: "Available Domains", url: "#" },
      ],
      estimatedTime: "7 min",
      difficulty: "intermediate",
    },
    {
      id: "community",
      title: "Join Our Community",
      icon: <Users size={20} />,
      videoSrc: "https://example.com/videos/community.mp4",
      videoTitle: "Building a Community of Change",
      videoPoster: "/vibrant-community-thumbnail.png",
      description:
        "Connect with like-minded individuals who share your values and concerns. Our growing community offers support, collaboration opportunities, and a network of resources to help you thrive.",
      keyPoints: [
        "Regular community events and meetups",
        "Collaboration opportunities with experts",
        "Support network for personal and professional growth",
        "Shared resources and knowledge exchange",
      ],
      resources: [
        { title: "Community Guidelines", url: "#" },
        { title: "Upcoming Events", url: "#" },
      ],
      estimatedTime: "6 min",
      difficulty: "beginner",
    },
  ]

  const currentModule = learningModules.find((module) => module.id === activeModule) || learningModules[0]
  const currentProgress = userProgress[activeModule] || { completed: false, bookmarked: false, lastViewed: "" }

  // Find next and previous modules for navigation
  const currentIndex = learningModules.findIndex((module) => module.id === activeModule)
  const prevModule = currentIndex > 0 ? learningModules[currentIndex - 1] : null
  const nextModule = currentIndex < learningModules.length - 1 ? learningModules[currentIndex + 1] : null

  // Calculate overall progress
  const completedModules = Object.values(userProgress).filter((p) => p.completed).length
  const progressPercentage = Math.round((completedModules / learningModules.length) * 100)

  // Difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
        <div
          className="bg-black dark:bg-white h-1 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0">
        {/* Left side - Navigation */}
        <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-800 md:max-h-[600px] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Learning Modules</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {completedModules} of {learningModules.length} completed
            </p>
          </div>

          <div className="space-y-1 p-2">
            {learningModules.map((module) => {
              const moduleProgress = userProgress[module.id] || { completed: false, bookmarked: false, lastViewed: "" }

              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center transition-all relative ${
                    activeModule === module.id
                      ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
                  }`}
                  aria-current={activeModule === module.id ? "page" : undefined}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span
                      className={`mr-3 flex-shrink-0 ${activeModule === module.id ? "" : "text-gray-500 dark:text-gray-300"}`}
                    >
                      {moduleProgress.completed ? (
                        <CheckCircle2 size={20} className="text-green-500 dark:text-green-400" />
                      ) : (
                        module.icon
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">{module.title}</span>

                      {module.estimatedTime && (
                        <span
                          className={`text-xs flex items-center mt-0.5 ${
                            activeModule === module.id
                              ? "text-gray-200 dark:text-gray-600"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Clock size={12} className="mr-1" />
                          {module.estimatedTime}
                        </span>
                      )}
                    </div>

                    {moduleProgress.bookmarked && (
                      <div className="relative ml-2 flex-shrink-0 text-blue-500 dark:text-blue-400">
                        <Bookmark size={16} />
                        <Check
                          size={10}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                      </div>
                    )}

                    {activeModule === module.id && <ChevronRight className="ml-2 flex-shrink-0" size={16} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right side - Content */}
        <div ref={contentRef} className="md:col-span-2 lg:col-span-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[500px]"
              >
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white animate-spin" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading content...</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {/* Video section */}
                <div className="relative">
                  <VideoPlayer
                    src={currentModule.videoSrc}
                    title={currentModule.videoTitle}
                    poster={currentModule.videoPoster}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onMute={(muted) => setIsMuted(muted)}
                  />

                  {/* Video controls overlay */}
                  <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <button
                      onClick={() => toggleBookmark(activeModule)}
                      className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                      aria-label={currentProgress.bookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      {currentProgress.bookmarked ? (
                        <div className="relative text-blue-400">
                          <Bookmark size={16} />
                          <Check
                            size={10}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentModule.title}</h2>
                      {currentModule.difficulty && (
                        <span
                          className={`ml-3 text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentModule.difficulty)}`}
                        >
                          {currentModule.difficulty.charAt(0).toUpperCase() + currentModule.difficulty.slice(1)}
                        </span>
                      )}
                    </div>

                    {currentModule.estimatedTime && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {currentModule.estimatedTime}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-5">{currentModule.description}</p>

                  <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Key Points:</h3>
                  <ul className="list-none text-sm text-gray-700 dark:text-gray-300 mb-5 space-y-2">
                    {currentModule.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-black dark:text-white mr-2 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Resources:</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentModule.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title}
                        <ExternalLink size={12} className="ml-1.5" />
                      </a>
                    ))}
                  </div>

                  {/* Feedback section */}
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                    {showFeedback ? (
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Was this content helpful?</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => provideFeedback(activeModule, "helpful")}
                            className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
                          >
                            <ThumbsUp size={16} className="mr-2" />
                            <span className="text-sm">Yes, helpful</span>
                          </button>
                          <button
                            onClick={() => provideFeedback(activeModule, "not-helpful")}
                            className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
                          >
                            <ThumbsDown size={16} className="mr-2" />
                            <span className="text-sm">Not helpful</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {prevModule && (
                            <button
                              onClick={() => handleModuleChange(prevModule.id)}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
                            >
                              <ArrowLeft size={16} className="mr-1" />
                              <span className="text-sm">Previous</span>
                            </button>
                          )}

                          {nextModule && (
                            <button
                              onClick={() => handleModuleChange(nextModule.id)}
                              className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
                            >
                              <span className="text-sm">Next</span>
                              <ArrowRight size={16} className="ml-1" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => markAsCompleted(activeModule)}
                          disabled={currentProgress.completed}
                          className={`px-4 py-1.5 rounded-lg transition-colors ${
                            currentProgress.completed
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default"
                              : "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                          }`}
                        >
                          {currentProgress.completed ? (
                            <span className="flex items-center">
                              <CheckCircle2 size={16} className="mr-1.5" />
                              Completed
                            </span>
                          ) : (
                            "Mark as Complete"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
