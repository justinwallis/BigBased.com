import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Globe, Linkedin, Github } from "lucide-react"
import { getUserProfileByUsername } from "@/app/actions/profile-actions"
import type { Metadata } from "next"

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const profile = await getUserProfileByUsername(params.username)

  if (!profile) {
    return {
      title: "Profile Not Found - Big Based",
      description: "The requested profile could not be found.",
    }
  }

  return {
    title: `${profile.full_name || profile.username} - Big Based`,
    description: profile.bio || `View ${profile.full_name || profile.username}'s profile on Big Based.`,
    openGraph: {
      title: `${profile.full_name || profile.username} - Big Based`,
      description: profile.bio || `View ${profile.full_name || profile.username}'s profile on Big Based.`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const profile = await getUserProfileByUsername(params.username)

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

  // X (Twitter) icon component
  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )

  const socialLinks = profile.social_links || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-10 space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || profile.username}
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(profile.full_name || profile.username || "U")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {profile.full_name || profile.username}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    @{profile.username}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Active Member
                  </Badge>
                </div>

                {/* Social Links */}
                {(socialLinks.x || socialLinks.linkedin || socialLinks.github || socialLinks.website) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {socialLinks.x && (
                      <a
                        href={socialLinks.x.startsWith("http") ? socialLinks.x : `https://${socialLinks.x}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <XIcon className="h-4 w-4" />
                        <span className="text-sm">X</span>
                      </a>
                    )}

                    {socialLinks.linkedin && (
                      <a
                        href={
                          socialLinks.linkedin.startsWith("http")
                            ? socialLinks.linkedin
                            : `https://${socialLinks.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}

                    {socialLinks.github && (
                      <a
                        href={
                          socialLinks.github.startsWith("http") ? socialLinks.github : `https://${socialLinks.github}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}

                    {socialLinks.website && (
                      <a
                        href={
                          socialLinks.website.startsWith("http")
                            ? socialLinks.website
                            : `https://${socialLinks.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {profile.bio && (
            <CardContent className="pt-0">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No recent activity to display.</p>
                  <p className="text-sm mt-2">Check back later for updates!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-medium">{new Date(profile.created_at).getFullYear()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Profile Views</span>
                  <span className="font-medium">Coming Soon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Contributions</span>
                  <span className="font-medium">Coming Soon</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Follow and connect with this user!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
