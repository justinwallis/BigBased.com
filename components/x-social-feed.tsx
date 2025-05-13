"use client"

import { useState, useEffect } from "react"
import { Heart, Repeat, MessageCircle, Share, MoreHorizontal, Bookmark, BarChart2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Types for our X posts
interface XPost {
  id: string
  username: string
  handle: string
  profileImage: string
  content: string
  image?: string
  likes: number
  reposts: number
  replies: number
  views: number
  timestamp: string
  verified: boolean
}

// Mock data for the feed
const mockPosts: XPost[] = [
  {
    id: "1",
    username: "John Patriot",
    handle: "john_patriot1776",
    profileImage: "/abstract-profile.png",
    content:
      "Just discovered #BigBased and I'm impressed with their mission to preserve our values and digital sovereignty!",
    likes: 42,
    reposts: 12,
    replies: 5,
    views: 1240,
    timestamp: "2h",
    verified: true,
  },
  {
    id: "2",
    username: "Liberty Tech",
    handle: "libertytech",
    profileImage: "/modern-tech-office.png",
    content:
      "We're proud to partner with #BigBased on their mission to create a parallel digital economy. The future is decentralized! 🚀",
    image: "/digital-sovereignty.png",
    likes: 87,
    reposts: 31,
    replies: 14,
    views: 3450,
    timestamp: "5h",
    verified: true,
  },
  {
    id: "3",
    username: "Faith & Freedom",
    handle: "faithfreedom",
    profileImage: "/placeholder.svg?key=jra1p",
    content:
      "The resources at #BigBased are incredible for anyone concerned about preserving our values in the digital age. Check out their library!",
    likes: 65,
    reposts: 23,
    replies: 8,
    views: 2100,
    timestamp: "1d",
    verified: false,
  },
  {
    id: "4",
    username: "Digital Sovereignty",
    handle: "digisovrn",
    profileImage: "/abstract-digital.png",
    content:
      "Just finished reading the latest article on #BigBased about building resilient communities. Essential reading for these times.",
    image: "/truth-archives.png",
    likes: 112,
    reposts: 45,
    replies: 17,
    views: 5200,
    timestamp: "2d",
    verified: true,
  },
]

// Featured post that we'll highlight
const featuredPost: XPost = {
  id: "featured",
  username: "Big Based",
  handle: "bigbased",
  profileImage: "/abstract-logo.png",
  content: "WOW!! Check out this site https://BigBased.com #BigBased",
  image: "/website-preview.png",
  likes: 248,
  reposts: 89,
  replies: 32,
  views: 12500,
  timestamp: "3h",
  verified: true,
}

// Component for a single X post
const XPostCard = ({ post, featured = false }: { post: XPost; featured?: boolean }) => {
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  // Increment counts when user interacts
  const likeCount = liked ? post.likes + 1 : post.likes
  const repostCount = reposted ? post.reposts + 1 : post.reposts

  return (
    <motion.div
      className={`border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-4 ${
        featured ? "bg-white dark:bg-gray-900 shadow-lg" : "bg-gray-50 dark:bg-gray-800"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        {/* Post header with profile info */}
        <div className="flex items-start mb-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
            <Image
              src={post.profileImage || "/placeholder.svg"}
              alt={post.username}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="font-bold text-gray-900 dark:text-white">{post.username}</span>
              {post.verified && (
                <span className="ml-1 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                  </svg>
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-400 ml-2">@{post.handle}</span>
              <span className="text-gray-500 dark:text-gray-400 mx-1">·</span>
              <span className="text-gray-500 dark:text-gray-400">{post.timestamp}</span>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Post content */}
        <div className="mb-3">
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
            {post.content.split("#BigBased").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-blue-500 hover:underline cursor-pointer">#BigBased</span>}
              </span>
            ))}
          </p>
        </div>

        {/* Post image if available */}
        {post.image && (
          <div className="mb-3 rounded-xl overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              width={500}
              height={280}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Post actions */}
        <div className="flex justify-between text-gray-500 dark:text-gray-400 pt-2">
          <button className="flex items-center hover:text-blue-500 transition-colors" onClick={() => {}}>
            <MessageCircle size={18} className="mr-1" />
            <span className="text-sm">{post.replies}</span>
          </button>

          <button
            className={`flex items-center hover:text-green-500 transition-colors ${reposted ? "text-green-500" : ""}`}
            onClick={() => setReposted(!reposted)}
          >
            <Repeat size={18} className="mr-1" />
            <span className="text-sm">{repostCount}</span>
          </button>

          <button
            className={`flex items-center hover:text-red-500 transition-colors ${liked ? "text-red-500" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart size={18} className={`mr-1 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            className={`flex items-center hover:text-blue-500 transition-colors ${bookmarked ? "text-blue-500" : ""}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark size={18} className={`mr-1 ${bookmarked ? "fill-current" : ""}`} />
          </button>

          <div className="flex items-center">
            <BarChart2 size={18} className="mr-1" />
            <span className="text-sm">{post.views}</span>
          </div>

          <button className="hover:text-blue-500 transition-colors">
            <Share size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Main component for the X social feed
export default function XSocialFeed() {
  const [posts, setPosts] = useState<XPost[]>(mockPosts)
  const [loading, setLoading] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)

  // Simulate fetching new posts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNewPostsAvailable(true)
    }, 30000) // Check for new posts every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Function to simulate loading new posts
  const loadNewPosts = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Create a new mock post
      const newPost: XPost = {
        id: `new-${Date.now()}`,
        username: "New Supporter",
        handle: `user${Math.floor(Math.random() * 1000)}`,
        profileImage: "/diverse-group.png",
        content: `Just discovered the amazing work at #BigBased! This is exactly what we need right now. ${
          Math.random() > 0.5 ? "🇺🇸" : "✝️"
        }`,
        likes: Math.floor(Math.random() * 50),
        reposts: Math.floor(Math.random() * 20),
        replies: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 1000) + 500,
        timestamp: "Just now",
        verified: Math.random() > 0.7,
      }

      // Add the new post to the beginning of the array
      setPosts([newPost, ...posts])
      setLoading(false)
      setNewPostsAvailable(false)
    }, 1000)
  }

  return (
    <section className="py-12 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Join The Conversation</h2>
          <p className="text-gray-600 dark:text-gray-300">
            See what people are saying about #BigBased and join the movement
          </p>
        </div>

        <div className="mb-8">
          <XPostCard post={featuredPost} featured={true} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold dark:text-white">Recent Posts</h3>
          <div className="flex items-center">
            <span className="text-blue-500 font-medium mr-2">#BigBased</span>
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
              X
            </div>
          </div>
        </div>

        {/* New posts notification */}
        <AnimatePresence>
          {newPostsAvailable && (
            <motion.button
              className="w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 font-medium rounded-lg mb-4 flex items-center justify-center"
              onClick={loadNewPosts}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Repeat size={16} className="mr-2" />
              Show new posts
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Posts feed */}
        <div>
          {posts.map((post) => (
            <XPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* View more button */}
        <div className="mt-6 text-center">
          <Link
            href="https://x.com/search?q=%23BigBased"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            View more on X
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
