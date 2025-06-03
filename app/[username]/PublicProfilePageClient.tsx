"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Linkedin,
  Github,
  Globe,
  Instagram,
  Youtube,
  Home,
  MapPin,
  Briefcase,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react"
import type { Profile } from "@/app/actions/profile-actions"

interface PublicProfilePageClientProps {
  profile: Profile | null
}

export function PublicProfilePageClient({ profile }: PublicProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState("posts")

  if (!profile) {
    notFound()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Social media icon components
  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )

  const DiscordIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
    </svg>
  )

  const TelegramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )

  const RumbleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.38 14.953c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zm-2.76 0c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zm5.52 0c-.393 0-.707-.314-.707-.707s.314-.707.707-.707.707.314.707.707-.314.707-.707.707zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 14.246c0 .69-.56 1.25-1.25 1.25H7.25c-.69 0-1.25-.56-1.25-1.25V9.754c0-.69.56-1.25 1.25-1.25h9.5c.69 0 1.25.56 1.25 1.25v4.492z" />
    </svg>
  )

  const TheRealWorldIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )

  const socialLinks = profile?.social_links || {}

  // Helper function to get the correct URL for social links
  const getSocialUrl = (platform: string, value: string) => {
    if (!value) return null

    // Clean the value by removing @ symbols and trimming
    const cleanValue = value.replace(/^@/, "").trim()

    switch (platform) {
      case "therealworld":
        // For The Real World, we don't return a URL since there's no public profile link
        return null
      case "x":
        return value.startsWith("http") ? value : `https://x.com/${cleanValue}`
      case "instagram":
        return value.startsWith("http") ? value : `https://instagram.com/${cleanValue}`
      case "youtube":
        return value.startsWith("http") ? value : `https://youtube.com/@${cleanValue}`
      case "tiktok":
        return value.startsWith("http") ? value : `https://tiktok.com/@${cleanValue}`
      case "facebook":
        return value.startsWith("http") ? value : `https://facebook.com/${cleanValue}`
      case "linkedin":
        return value.startsWith("http") ? value : `https://linkedin.com/in/${cleanValue}`
      case "github":
        return value.startsWith("http") ? value : `https://github.com/${cleanValue}`
      case "telegram":
        return value.startsWith("http") ? value : `https://t.me/${cleanValue}`
      case "rumble":
        return value.startsWith("http") ? value : `https://rumble.com/c/${cleanValue}`
      case "discord":
        // Discord doesn't have direct profile links, so we return null
        return null
      case "website":
        return value.startsWith("http") ? value : `https://${value}`
      default:
        return value.startsWith("http") ? value : `https://${value}`
    }
  }

  const socialPlatforms = [
    { key: "x", icon: XIcon, label: "X (Twitter)" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "youtube", icon: Youtube, label: "YouTube" },
    { key: "tiktok", icon: TikTokIcon, label: "TikTok" },
    { key: "facebook", icon: FacebookIcon, label: "Facebook" },
    { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { key: "github", icon: Github, label: "GitHub" },
    { key: "telegram", icon: TelegramIcon, label: "Telegram" },
    { key: "rumble", icon: RumbleIcon, label: "Rumble" },
    { key: "website", icon: Globe, label: "Website" },
  ]

  // Special platforms that show but don't link
  const specialPlatforms = [
    { key: "discord", icon: DiscordIcon, label: "Discord" },
    { key: "therealworld", icon: TheRealWorldIcon, label: "The Real World" },
  ]

  // Get current location string
  const getCurrentLocation = () => {
    if (!profile?.location_info) return null

    const parts = [
      profile?.location_info?.current_city,
      profile?.location_info?.current_state,
      profile?.location_info?.current_country,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(", ") : null
  }

  // Generate a short bio from profile data
  const generateShortBio = () => {
    const parts = []

    if (profile?.personal_details?.religious_views) {
      parts.push(profile?.personal_details.religious_views)
    }

    if (profile?.personal_details?.political_views) {
      parts.push(profile?.personal_details.political_views)
    }

    if (profile?.personal_info?.gender) {
      parts.push(profile?.personal_info.gender)
    }

    return parts.join(" · ")
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full flex justify-center">
        <div className="max-w-[1150px] w-full">
          {/* Cover Photo */}
          <div className="relative">
            <div
              className="h-[446px] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative rounded-b-lg overflow-hidden"
              style={{
                backgroundImage: profile?.banner_url ? `url(${profile.banner_url})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: profile?.banner_position || "center",
              }}
            >
              {/* Edit cover photo button */}
              <button className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14" />
                  <circle cx="8" cy="9" r="2" />
                </svg>
                Edit cover photo
              </button>
            </div>

            {/* Profile Info - Responsive Layout */}
            <div className="relative">
              {/* Large screens: Horizontal layout with 15% overlap - Facebook style */}
              <div className="hidden lg:block">
                <div className="pt-4 pb-3 px-8 flex items-end justify-between">
                  <div className="flex items-end space-x-6">
                    {/* Profile Picture - 15% overlap on large screens */}
                    <div className="relative -mt-44">
                      <div className="relative">
                        <Avatar className="h-40 w-40 border-4 border-white dark:border-gray-900 shadow-lg">
                          <AvatarImage
                            src={profile?.avatar_url || "/placeholder.svg"}
                            alt={profile?.full_name || profile?.username}
                          />
                          <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(profile?.full_name || profile?.username || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-3 right-3 bg-gray-200 dark:bg-gray-700 rounded-full p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Name and Info - positioned to the right of profile picture */}
                    <div className="pb-2">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {profile?.full_name || profile?.username}
                        {profile?.personal_info?.nickname && (
                          <span className="text-2xl text-gray-600 dark:text-gray-400 ml-2">
                            ({profile.personal_info.nickname})
                          </span>
                        )}
                      </h1>
                      <div className="flex items-center mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{profile?.username}</p>
                        <span className="mx-2 text-gray-400">•</span>
                        <Badge className="bg-green-500/80 text-white border-0">Active Member</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="mr-4 font-medium">0 followers</span>
                        <span className="font-medium">0 following</span>
                      </div>

                      {/* Friend avatars */}
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                            >
                              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Right aligned and vertically centered */}
                  <div className="flex items-center justify-end self-center">
                    <div className="flex items-center space-x-2">
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-md font-medium flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        Edit
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-md font-medium flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                        Add to story
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium screens: Horizontal layout with 0% overlap */}
              <div className="hidden md:block lg:hidden">
                <div className="pt-4 pb-4 px-6 flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Profile Picture - 0% overlap on medium screens */}
                    <div className="relative">
                      <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-lg">
                          <AvatarImage
                            src={profile?.avatar_url || "/placeholder.svg"}
                            alt={profile?.full_name || profile?.username}
                          />
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(profile?.full_name || profile?.username || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-2 right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Name and Info */}
                    <div className="pt-2">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profile?.full_name || profile?.username}
                        {profile?.personal_info?.nickname && (
                          <span className="text-xl text-gray-600 dark:text-gray-400 ml-2">
                            ({profile.personal_info.nickname})
                          </span>
                        )}
                      </h1>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{profile?.username}</p>
                        <span className="mx-2 text-gray-400">•</span>
                        <Badge className="bg-green-500/80 text-white border-0">Active Member</Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-4 font-medium">0 followers</span>
                        <span className="font-medium">0 following</span>
                      </div>

                      {/* Friend avatars */}
                      <div className="flex items-center mt-3">
                        <div className="flex -space-x-2 mr-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                            >
                              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Right aligned */}
                  <div className="flex items-center justify-end self-center">
                    <div className="flex items-center space-x-2">
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        Edit
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                        Add to story
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small screens: Centered vertical layout with 50% overlap */}
              <div className="block md:hidden">
                <div className="pt-4 pb-4 px-4">
                  {/* Profile Picture - 50% overlap on small screens, centered */}
                  <div className="flex justify-center -mt-20 mb-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-lg">
                        <AvatarImage
                          src={profile?.avatar_url || "/placeholder.svg"}
                          alt={profile?.full_name || profile?.username}
                        />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(profile?.full_name || profile?.username || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-2 right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Name and Info - Centered */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.full_name || profile?.username}
                      {profile?.personal_info?.nickname && (
                        <span className="block text-lg text-gray-600 dark:text-gray-400 mt-1">
                          ({profile.personal_info.nickname})
                        </span>
                      )}
                    </h1>
                    <div className="flex items-center justify-center mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{profile?.username}</p>
                      <span className="mx-2 text-gray-400">•</span>
                      <Badge className="bg-green-500/80 text-white border-0">Active Member</Badge>
                    </div>
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="mr-4 font-medium">0 followers</span>
                      <span className="font-medium">0 following</span>
                    </div>

                    {/* Friend avatars - Centered */}
                    <div className="flex items-center justify-center mt-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons - Centered and stacked */}
                    <div className="flex flex-col space-y-2 mt-4">
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md font-medium flex items-center justify-center gap-1.5 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                          Edit
                        </button>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md font-medium flex items-center justify-center gap-1.5 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
                          Add to story
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-300 dark:bg-gray-700 w-full"></div>

          {/* Navigation Tabs */}
          <div className="sticky top-0 z-10">
            <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="h-12 bg-transparent border-0 p-0 space-x-1 justify-start">
                  <TabsTrigger
                    value="posts"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="reels"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    Reels
                  </TabsTrigger>
                  <TabsTrigger
                    value="photos"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    Photos
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                  >
                    Videos
                  </TabsTrigger>
                  <TabsTrigger
                    value="groups"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 hidden md:flex"
                  >
                    Groups
                  </TabsTrigger>
                  <TabsTrigger
                    value="more"
                    className="bg-transparent border-0 border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-4 py-3 font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 hidden lg:flex"
                  >
                    More
                  </TabsTrigger>
                </TabsList>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Sidebar - Intro */}
              <div className="space-y-4">
                {/* Intro Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Intro</h2>

                  {/* Bio */}
                  {profile?.bio && <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>}

                  {/* Short Bio Tags */}
                  {generateShortBio() && <p className="text-gray-700 dark:text-gray-300 mb-4">{generateShortBio()}</p>}

                  {/* Website Link */}
                  {socialLinks.website && (
                    <a
                      href={getSocialUrl("website", socialLinks.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {socialLinks.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}

                  {/* Profile Info List */}
                  <div className="space-y-3">
                    {/* Work */}
                    {profile?.work_info?.company && (
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {profile?.work_info?.position ? `${profile?.work_info.position} at ` : "Works at "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {profile?.work_info.company}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {profile?.education_info?.school && (
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Studied {profile?.education_info?.degree || "at"}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {" "}
                              {profile?.education_info.school}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {getCurrentLocation() && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Lives in{" "}
                            <span className="font-medium text-gray-900 dark:text-white">{getCurrentLocation()}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hometown */}
                    {profile?.location_info?.hometown && (
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            From{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {profile?.location_info.hometown}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Joined Date */}
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Joined{" "}
                          {new Date(profile?.created_at || Date.now()).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Bio Button */}
                  <button className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md font-medium">
                    Edit bio
                  </button>

                  {/* Social Media Links */}
                  {(socialPlatforms.some((platform) => socialLinks[platform.key]) ||
                    specialPlatforms.some((platform) => socialLinks[platform.key])) && (
                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {/* Regular social platforms with links */}
                      {socialPlatforms.map(({ key, icon: Icon, label }) => {
                        const url = getSocialUrl(key, socialLinks[key])
                        if (!url || key === "website") return null // Website already shown above

                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                            title={label}
                          >
                            <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </a>
                        )
                      })}

                      {/* Special platforms without links */}
                      {specialPlatforms.map(({ key, icon: Icon, label }) => {
                        if (!socialLinks[key]) return null

                        const handleSpecialClick = () => {
                          if (key === "discord") {
                            alert(`Discord: ${socialLinks[key]}`)
                          } else if (key === "therealworld") {
                            alert(
                              `The Real World member: ${socialLinks[key]}

The Real World is Andrew Tate's exclusive community platform for entrepreneurs and high-achievers.`,
                            )
                          }
                        }

                        return (
                          <button
                            key={key}
                            onClick={handleSpecialClick}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                            title={`${label}: ${socialLinks[key]}`}
                          >
                            <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Profile Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Digital creator</span>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Stats</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(profile?.created_at || Date.now()).getFullYear()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Profile Views</span>
                      <span className="font-medium text-gray-900 dark:text-white">Coming Soon</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Contributions</span>
                      <span className="font-medium text-gray-900 dark:text-white">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                {/* Create Post Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={profile?.avatar_url || "/placeholder.svg"}
                          alt={profile?.full_name || profile?.username}
                        />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(profile?.full_name || profile?.username || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="What's on your mind?"
                          className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3">
                      <div className="flex justify-between">
                        <button className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 py-1.5 rounded-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-red-500"
                          >
                            <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z" />
                            <path d="M6 11V8" />
                            <path d="M10 11V7" />
                            <path d="M14 11v-1" />
                            <path d="M18 11V9" />
                          </svg>
                          Live video
                        </button>
                        <button className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 py-1.5 rounded-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-green-500"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          Photo/video
                        </button>
                        <button className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 py-1.5 rounded-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-purple-500"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          Reel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="posts" value={activeTab} className="w-full">
                  {/* Posts Tab */}
                  <TabsContent value="posts" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Posts</h3>
                        <div className="flex items-center">
                          <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-medium mr-2">
                            Filters
                          </button>
                          <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-md text-sm font-medium">
                            Manage posts
                          </button>
                        </div>
                      </div>
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No posts to display yet.</p>
                        <p className="text-sm mt-2">Check back later for updates!</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* About Tab */}
                  <TabsContent value="about" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About</h3>
                        {profile?.personal_details?.about_me ? (
                          <p className="text-gray-700 dark:text-gray-300">{profile?.personal_details.about_me}</p>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No additional information provided.</p>
                        )}
                      </div>

                      {/* Personal Information */}
                      {(profile?.personal_info?.nickname ||
                        profile?.personal_info?.birthday ||
                        profile?.personal_info?.gender ||
                        (profile?.personal_info?.languages && profile?.personal_info.languages.length > 0)) && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Personal Information
                          </h3>
                          <div className="space-y-3">
                            {profile?.personal_info?.nickname && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Nickname:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {profile?.personal_info.nickname}
                                </span>
                              </div>
                            )}
                            {profile?.personal_info?.birthday && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Birthday:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {new Date(profile?.personal_info.birthday).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            )}
                            {profile?.personal_info?.gender && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Gender:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {profile?.personal_info.gender}
                                </span>
                              </div>
                            )}
                            {profile?.personal_info?.languages && profile?.personal_info.languages.length > 0 && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Languages:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {Array.isArray(profile?.personal_info.languages)
                                    ? profile?.personal_info.languages.join(", ")
                                    : profile?.personal_info.languages}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Location Information */}
                      {(profile?.location_info?.current_city ||
                        profile?.location_info?.current_state ||
                        profile?.location_info?.current_country ||
                        profile?.location_info?.hometown) && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Location</h3>
                          <div className="space-y-3">
                            {(profile?.location_info?.current_city ||
                              profile?.location_info?.current_state ||
                              profile?.location_info?.current_country) && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Current:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {[
                                    profile?.location_info.current_city,
                                    profile?.location_info.current_state,
                                    profile?.location_info.current_country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                            {profile?.location_info?.hometown && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Hometown:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {profile?.location_info.hometown}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(profile?.contact_info?.phone || profile?.contact_info?.alt_email) && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact</h3>
                          <div className="space-y-3">
                            {profile?.contact_info?.phone && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Phone:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {profile?.contact_info.phone}
                                </span>
                              </div>
                            )}
                            {profile?.contact_info?.alt_email && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Alt Email:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {profile?.contact_info.alt_email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Personal Details */}
                      {(profile?.personal_details?.relationship_status ||
                        profile?.personal_details?.political_views ||
                        profile?.personal_details?.religious_views) && (
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Personal Details</h3>
                          <div className="space-y-3">
                            {profile?.personal_details?.relationship_status && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Relationship:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {profile?.personal_details.relationship_status.replace(/_/g, " ")}
                                </span>
                              </div>
                            )}
                            {profile?.personal_details?.political_views && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Political Views:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {profile?.personal_details.political_views}
                                </span>
                              </div>
                            )}
                            {profile?.personal_details?.religious_views && (
                              <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
                                  Religious Views:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {profile?.personal_details.religious_views}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Reels Tab */}
                  <TabsContent value="reels" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No reels to display yet.</p>
                        <p className="text-sm mt-2">Reels will appear here when shared.</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Photos Tab */}
                  <TabsContent value="photos" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No photos to display yet.</p>
                        <p className="text-sm mt-2">Photos will appear here when shared.</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Videos Tab */}
                  <TabsContent value="videos" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No videos to display yet.</p>
                        <p className="text-sm mt-2">Videos will appear here when shared.</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Groups Tab */}
                  <TabsContent value="groups" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No groups to display yet.</p>
                        <p className="text-sm mt-2">Groups will appear here when joined.</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* More Tab */}
                  <TabsContent value="more" className="mt-0">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>Additional content coming soon.</p>
                        <p className="text-sm mt-2">Stay tuned for more features!</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
