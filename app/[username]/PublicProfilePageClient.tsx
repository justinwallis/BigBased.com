"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { FaCamera } from "react-icons/fa"
import { MdOutlineGroup } from "react-icons/md"
import { IoIosVideocam } from "react-icons/io"

interface PublicProfilePageClientProps {
  profile: any
}

export function PublicProfilePageClient({ profile }: PublicProfilePageClientProps) {
  const { data: session } = useSession()
  const isCurrentUserProfile = session?.user?.username === profile?.username
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="w-full">
      {/* Cover Photo and Profile Picture */}
      <div className="relative h-80 rounded-b-lg overflow-hidden">
        <Image
          src={profile?.coverPhoto || "/default-cover.jpg"}
          alt="Cover Photo"
          fill
          className="object-cover object-center"
        />
        {isCurrentUserProfile && (
          <button className="absolute top-2 right-2 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200 focus:outline-none z-20">
            <FaCamera size={20} />
          </button>
        )}
        <div className="absolute bottom-0 left-0 w-full flex items-end p-4">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white">
            <Image
              src={profile?.profilePicture || "/default-profile.jpg"}
              alt="Profile Picture"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-white text-2xl font-semibold">{profile?.name}</h2>
            <p className="text-gray-300">@{profile?.username}</p>
          </div>
        </div>
      </div>

      {/* Nickname and Bio */}
      <div className="px-4 mt-4">
        <span className="md:hidden font-semibold">Nickname:</span>
        <span className="hidden md:inline font-normal">Nickname:</span>
        <span className="ml-2">{profile?.nickname}</span>
        <p className="mt-2">{profile?.bio}</p>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 px-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "posts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } focus:outline-none`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "videos"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } focus:outline-none flex items-center`}
          >
            <span className="md:hidden">Videos</span>
            <span className="hidden md:block">Videos</span>
            <IoIosVideocam className="ml-1" />
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "groups"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } focus:outline-none flex items-center`}
          >
            <span className="md:hidden">Groups</span>
            <span className="hidden md:block">Groups</span>
            <MdOutlineGroup className="ml-1" />
          </button>
          {/* Add more tabs here as needed */}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === "posts" && <p>Posts content goes here.</p>}
        {activeTab === "videos" && <p>Videos content goes here.</p>}
        {activeTab === "groups" && <p>Groups content goes here.</p>}
      </div>
    </div>
  )
}
