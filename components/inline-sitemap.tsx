"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Home, Info, BookOpen, Users, Share2, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define the site structure
const siteStructure = [
  {
    id: "home",
    title: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    children: [],
  },
  {
    id: "about",
    title: "About",
    path: "/about",
    icon: <Info className="w-5 h-5" />,
    children: [
      { id: "mission", title: "Our Mission", path: "/about/mission" },
      { id: "team", title: "Our Team", path: "/about/team" },
      { id: "history", title: "History", path: "/about/history" },
    ],
  },
  {
    id: "revolution",
    title: "Revolution",
    path: "/revolution",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { id: "manifesto", title: "Manifesto", path: "/revolution/manifesto" },
      { id: "movement", title: "The Movement", path: "/revolution/movement" },
      { id: "join", title: "Join Us", path: "/revolution/join" },
    ],
  },
  {
    id: "features",
    title: "Features",
    path: "/features",
    icon: <Users className="w-5 h-5" />,
    children: [
      { id: "library", title: "Truth Library", path: "/features/library" },
      { id: "community", title: "Community", path: "/features/community" },
      { id: "resources", title: "Resources", path: "/features/resources" },
    ],
  },
  {
    id: "partners",
    title: "Partners",
    path: "/partners",
    icon: <Share2 className="w-5 h-5" />, // Changed from Handshake to Share2
    children: [
      { id: "organizations", title: "Organizations", path: "/partners/organizations" },
      { id: "companies", title: "Companies", path: "/partners/companies" },
      { id: "become", title: "Become a Partner", path: "/partners/become" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    path: "/contact",
    icon: <Mail className="w-5 h-5" />,
    children: [],
  },
]

export default function InlineSitemap() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isSectionExpanded = (id: string) => expandedSections.includes(id)

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Site Navigation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteStructure.map((section) => (
            <div key={section.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Link href={section.path} className="text-xl font-semibold hover:underline flex items-center">
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </Link>
                {section.children.length > 0 && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label={isSectionExpanded(section.id) ? "Collapse section" : "Expand section"}
                  >
                    {isSectionExpanded(section.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {section.children.length > 0 && isSectionExpanded(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 ml-4 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                      {section.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.path}
                            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
