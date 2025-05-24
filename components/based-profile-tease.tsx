"use client"

import { useState } from "react"
import { Shield, Award, User, Fingerprint, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function BasedProfileTease() {
  const { user } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showDomains, setShowDomains] = useState(false)

  // Sample faction badges
  const factions = [
    { name: "Truth Seeker", color: "bg-blue-500", icon: <Shield className="h-5 w-5" /> },
    { name: "Digital Sovereign", color: "bg-purple-500", icon: <Lock className="h-5 w-5" /> },
    { name: "Freedom Fighter", color: "bg-red-500", icon: <Award className="h-5 w-5" /> },
    { name: "Faith Defender", color: "bg-green-500", icon: <Fingerprint className="h-5 w-5" /> },
  ]

  // For demo purposes, select a random faction
  const userFaction = factions[Math.floor(Math.random() * factions.length)]

  // Sample test scores
  const testScores = [
    { name: "Cringe Immunity", score: 89 },
    { name: "Truth Discernment", score: 76 },
    { name: "Digital Sovereignty", score: 92 },
  ]

  // Sample domains (just a few examples)
  const sampleDomains = [
    "based.church",
    "based.news",
    "based.life",
    "based.network",
    "based.community",
    "based.family",
    "based.media",
    "based.tech",
  ]

  return (
    <section className="py-16 px-8 md:px-16 relative overflow-hidden border-t border-gray-200 dark:border-gray-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Binary code background - subtle effect */}
      <div className="binary-background absolute inset-0 opacity-5 select-none pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="binary-row" style={{ top: `${i * 10}%`, animationDelay: `${i * 0.1}s` }}>
            {Array.from({ length: 20 }).map((_, j) => (
              <span
                key={j}
                className="inline-block mx-1 text-gray-400 dark:text-gray-500 opacity-30"
                style={{ animationDelay: `${j * 0.05}s` }}
              >
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Your Based Identity</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            One profile, 500+ domains. Establish your digital sovereignty across the Based ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left column - Profile preview */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden border-0 transform transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{user ? user.email?.split("@")[0] : "YourBasedName"}</h3>
                  <div
                    className={`flex items-center mt-1 px-2 py-1 rounded-full text-white text-xs ${userFaction.color}`}
                  >
                    {userFaction.icon}
                    <span className="ml-1">{userFaction.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {testScores.map((test, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{test.name}</span>
                      <span className="font-medium">{test.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${test.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  asChild
                >
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    {user ? "Edit Your Profile" : "Create Your Profile"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Middle column - Domain visualization */}
          <div className="hidden lg:block relative h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 animate-spin-slow"></div>

                {/* Domain dots */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = i * 15 * (Math.PI / 180)
                  const x = 50 + 45 * Math.cos(angle)
                  const y = 50 + 45 * Math.sin(angle)

                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  )
                })}

                {/* Center profile */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
            </div>

            {/* Domain visualization - no floating text */}
            <div className="absolute inset-0"></div>
          </div>

          {/* Right column - Reserve name CTA */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-black text-white shadow-lg overflow-hidden border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Reserve Your Based Name</h3>
              <p className="mb-6 text-gray-300">
                Secure your identity across 500+ domains in the Based ecosystem. One name, endless possibilities.
              </p>

              <div className="mb-6 bg-black/30 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">yourname</span>
                  <span className="text-white">@</span>
                  <button
                    className="ml-2 text-blue-400 hover:text-blue-300 focus:outline-none"
                    onClick={() => setShowDomains(!showDomains)}
                  >
                    based.{showDomains ? "..." : "network"} {showDomains ? "▲" : "▼"}
                  </button>
                </div>

                {showDomains && (
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-400">
                    {sampleDomains.slice(0, 6).map((domain) => (
                      <div key={domain} className="hover:text-white transition-colors">
                        {domain.replace("based.", "")}
                      </div>
                    ))}
                    <div className="text-gray-500">+ 494 more</div>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                onMouseEnter={() => setIsNameHovered(true)}
                onMouseLeave={() => setIsNameHovered(false)}
                asChild
              >
                <Link href="/reserve-name">
                  {isNameHovered ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Secure Your Identity
                    </>
                  ) : (
                    <>
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Reserve Your Name
                    </>
                  )}
                </Link>
              </Button>

              <p className="mt-4 text-xs text-gray-400 text-center">
                First come, first served. Reserve now before someone else does.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
