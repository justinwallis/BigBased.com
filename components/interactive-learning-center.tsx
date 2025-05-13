"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Shield, Zap, Users, ChevronRight, ExternalLink } from "lucide-react"
import { VideoPlayer } from "./video-player"

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
}

export function InteractiveLearningCenter() {
  const [activeModule, setActiveModule] = useState<string>("mission")

  const learningModules: LearningModule[] = [
    {
      id: "mission",
      title: "Our Mission",
      icon: <Shield size={20} />,
      videoSrc: "https://example.com/videos/mission.mp4", // Replace with actual video URL
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
    },
    {
      id: "resources",
      title: "Educational Resources",
      icon: <BookOpen size={20} />,
      videoSrc: "https://example.com/videos/resources.mp4", // Replace with actual video URL
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
    },
    {
      id: "technology",
      title: "Technology Solutions",
      icon: <Zap size={20} />,
      videoSrc: "https://example.com/videos/technology.mp4", // Replace with actual video URL
      videoTitle: "Technology Solutions for Digital Independence",
      videoPoster: "/placeholder.svg?key=nkeos",
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
    },
    {
      id: "domains",
      title: "Domain Collection",
      icon: <Globe size={20} />,
      videoSrc: "https://example.com/videos/domains.mp4", // Replace with actual video URL
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
    },
    {
      id: "community",
      title: "Join Our Community",
      icon: <Users size={20} />,
      videoSrc: "https://example.com/videos/community.mp4", // Replace with actual video URL
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
    },
  ]

  const currentModule = learningModules.find((module) => module.id === activeModule) || learningModules[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Left side - Navigation */}
      <div className="md:col-span-1 space-y-1">
        {learningModules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-all ${
              activeModule === module.id
                ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
          >
            <span className="mr-2">{module.icon}</span>
            <span className="text-sm">{module.title}</span>
            {activeModule === module.id && <ChevronRight className="ml-auto" size={16} />}
          </button>
        ))}
      </div>

      {/* Right side - Content */}
      <div className="md:col-span-2 lg:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-0">
              <VideoPlayer
                src={currentModule.videoSrc}
                title={currentModule.videoTitle}
                poster={currentModule.videoPoster}
              />

              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{currentModule.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{currentModule.description}</p>

                <h4 className="text-sm font-semibold mb-2">Key Points:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                  {currentModule.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <h4 className="text-sm font-semibold mb-2">Resources:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentModule.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {resource.title}
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
