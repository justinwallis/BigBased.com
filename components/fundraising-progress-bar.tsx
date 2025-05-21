"use client"

import { useState, useEffect, useRef } from "react"
import {
  Heart,
  DollarSign,
  Users,
  X,
  ChevronDown,
  ExternalLink,
  Check,
  Edit2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FundraisingProgressBarProps {
  campaignUrl?: string
}

export default function FundraisingProgressBar({
  campaignUrl = "https://www.givesendgo.com/bigbased",
}: FundraisingProgressBarProps) {
  // State for fundraising data
  const [raised, setRaised] = useState(42750)
  const [goal, setGoal] = useState(100000)
  const [donors, setDonors] = useState(317)
  const [loading, setLoading] = useState(true)
  const [showSparkle, setShowSparkle] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editingMessage, setEditingMessage] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState("")

  const shareMessagesRef = useRef({
    twitter:
      "🛡️ Help us build the Based Future—Truth, Faith & Decentralized Tech! Support our mission to break the matrix of centralized control and censorship. #BigBased #DigitalFreedom",
    facebook:
      "I'm supporting BigBased in their mission to build a tech ecosystem rooted in truth, faith, and freedom. Join me in helping them reach their fundraising goal!",
    linkedin:
      "I've just contributed to an important cause: BigBased is building decentralized tech tools to protect digital freedom and fight censorship. Consider supporting their mission!",
    email:
      "Subject: Join me in supporting BigBased\n\nHi,\n\nI wanted to share this important fundraising campaign with you. BigBased is building a tech ecosystem rooted in truth, faith, and freedom, designed to break the matrix of centralized control and censorship.\n\nPlease consider supporting their mission: https://www.givesendgo.com/bigbased\n\nThanks!",
  })

  // Calculate percentage raised
  const percentRaised = Math.min(Math.round((raised / goal) * 100), 100)

  // Simulate fetching data from GiveSendGo API
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!isMounted) return

      setLoading(true)
      try {
        // In a real implementation, this would be an API call to GiveSendGo
        // For now, we'll simulate with random fluctuations
        setTimeout(() => {
          if (!isMounted) return

          // Simulate small random fluctuations in the data
          const randomFluctuation = Math.random() * 500 - 250
          setRaised((prev) => Math.max(prev + randomFluctuation, prev))

          if (Math.floor(Math.random() * 3) === 0) {
            setDonors((prev) => prev + 1)
          }

          setLoading(false)
        }, 1500)
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching fundraising data:", error)
          setLoading(false)
        }
      }
    }

    fetchData()

    // Refresh data periodically
    const intervalId = setInterval(fetchData, 60000) // every minute

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  // Periodically show sparkle animation
  useEffect(() => {
    let isMounted = true

    const sparkleInterval = setInterval(() => {
      if (isMounted) {
        setShowSparkle(true)
        setTimeout(() => {
          if (isMounted) {
            setShowSparkle(false)
          }
        }, 2000)
      }
    }, 10000)

    return () => {
      isMounted = false
      clearInterval(sparkleInterval)
    }
  }, [])

  // Handle sharing on different platforms
  const handleShare = (platform) => {
    const message = shareMessagesRef.current[platform]
    const encodedMessage = encodeURIComponent(message)
    const encodedUrl = encodeURIComponent(campaignUrl)

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case "email":
        const emailParts = message.split("Subject: ")
        const emailSubject = emailParts[1]?.split("\n\n")[0] || "Join me in supporting BigBased"
        const emailBody = emailParts[1]?.split("\n\n")[1] || message
        shareUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody + "\n\n" + campaignUrl)}`
        break
      default:
        return
    }

    // Open share dialog
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(campaignUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Edit share message
  const editShareMessage = (platform) => {
    setCurrentPlatform(platform)
    setEditingMessage(true)
  }

  // Update share message
  const updateShareMessage = (newMessage) => {
    if (currentPlatform) {
      shareMessagesRef.current = {
        ...shareMessagesRef.current,
        [currentPlatform]: newMessage,
      }
    }
    setEditingMessage(false)
    setCurrentPlatform("")
  }

  // Full campaign description
  const fullDescription = `
🛡️ Help Us Build the Based Future—Truth, Faith & Decentralized Tech ✝️🔥

I've spent the last 20 years preparing for this mission—to build a movement and a tech ecosystem rooted in truth, faith, and freedom, and designed to break the matrix of centralized control, censorship, and spiritual decay.

I helped build the original Infowars and WeAreChange pages from 0 to 3.5 million followers before being systematically censored and erased by the globalist machine. I never broke terms of service—only told the truth.

But instead of quitting, I went underground—sacrificing 7+ years of my life to earn and reinvest over $250,000 into this vision:

- 💰 $200K into converting my home into a 20–30 person production compound

- 💻 $60K+ into AI software, dev tools, and hosting

- ⏳ 10,000+ hours of personal research and development

- 🧠 Leading to the birth of BigBased.AI, and a full arsenal of Based tech tools ready to launch


We've never taken VC money—and we're not looking to hand over control.

But if there are mission-aligned funders out there who believe in truth, tech, and freedom without strings attached, we're open to a conversation.

We're not selling out our IP. This is for the people, to fight back with real tools, not just talk.

Now, we're inviting you to stand with us.



💎 Your support will help us:

- Finish the Based AI tool suite and make it available to the people

- Support our devs, builders, and freedom-fighting content creators

- Run Based Hackathons and promote censorship-free projects

- Launch the Based Network—media, finance, governance, and education in one unstoppable platform


🔥 This is bigger than a donation.

It's a chance to be part of a once-in-a-generation movement to reclaim truth, protect the next generation, and build something they can't shut down.

If you've ever said: "Someone needs to build something better…"

We already are. And now, you can help us finish it.

🩸 Truth is under attack. Let's fight back with code.

🙏 Thank you for standing with us.

— Justin Wallis

Founder, BigBased.tech + BigBased.AI

Pitch Deck: BasedPitch.com
  `

  // Shortened description for the card
  const shortDescription = `🛡️ Help Us Build the Based Future—Truth, Faith & Decentralized Tech ✝️🔥

I've spent the last 20 years preparing for this mission—to build a movement and a tech ecosystem rooted in truth, faith, and freedom, and designed to break the matrix of centralized control, censorship, and spiritual decay.`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
      {/* Header with GiveSendGo branding */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="text-white mr-2" />
          <h3 className="text-white font-bold text-lg">BigBased Fundraising Campaign</h3>
        </div>
        <div className="text-white text-sm font-medium">via GiveSendGo</div>
      </div>

      {/* Campaign description */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 text-sm">{shortDescription}</p>
        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={() => setShowFullDescription(true)}
            className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center hover:underline"
          >
            Read More <ChevronDown size={16} className="ml-1" />
          </button>
          <a
            href={campaignUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center hover:underline"
          >
            View on GiveSendGo <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>

      {/* Progress bar and stats */}
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300 font-medium">${raised.toLocaleString()} raised</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Goal: ${goal.toLocaleString()}</span>
          </div>

          {/* Progress bar container */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
            {/* Animated progress bar */}
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${percentRaised}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Animated pulse effect */}
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse-slow"></div>
            </motion.div>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800 dark:text-white">{percentRaised}%</span>
            </div>

            {/* Sparkle animation */}
            <AnimatePresence>
              {showSparkle && (
                <motion.div
                  className="absolute top-0 h-full"
                  style={{ left: `${percentRaised}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-6 h-6 -ml-3 -mt-3 text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center">
            <DollarSign className="text-emerald-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Donation</p>
              <p className="font-bold text-gray-800 dark:text-white">${Math.round(raised / donors).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center">
            <Users className="text-emerald-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Donors</p>
              <p className="font-bold text-gray-800 dark:text-white">{donors}</p>
            </div>
          </div>
        </div>

        {/* Social sharing section */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Share This Campaign</h4>
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:underline flex items-center"
            >
              {showShareOptions ? "Hide Options" : "Show Options"}
              <ChevronDown
                size={14}
                className={`ml-1 transition-transform duration-200 ${showShareOptions ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("twitter")}
              className="flex items-center justify-center p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90"
              aria-label="Share on Twitter"
            >
              <Twitter size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("facebook")}
              className="flex items-center justify-center p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90"
              aria-label="Share on Facebook"
            >
              <Facebook size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("linkedin")}
              className="flex items-center justify-center p-2 bg-[#0A66C2] text-white rounded-full hover:bg-opacity-90"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare("email")}
              className="flex items-center justify-center p-2 bg-gray-600 text-white rounded-full hover:bg-opacity-90"
              aria-label="Share via Email"
            >
              <Mail size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyLink}
              className="flex items-center justify-center p-2 bg-gray-400 dark:bg-gray-600 text-white rounded-full hover:bg-opacity-90"
              aria-label="Copy Link"
            >
              {copied ? <Check size={18} /> : <Link size={18} />}
            </motion.button>
          </div>

          {/* Customizable share messages */}
          {showShareOptions && (
            <div className="mt-4 space-y-3">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Customize Share Messages:</div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-[#1DA1F2]">Twitter</span>
                  <button
                    onClick={() => editShareMessage("twitter")}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {shareMessagesRef.current.twitter}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-[#1877F2]">Facebook</span>
                  <button
                    onClick={() => editShareMessage("facebook")}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {shareMessagesRef.current.facebook}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-[#0A66C2]">LinkedIn</span>
                  <button
                    onClick={() => editShareMessage("linkedin")}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {shareMessagesRef.current.linkedin}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</span>
                  <button
                    onClick={() => editShareMessage("email")}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {shareMessagesRef.current.email.replace(/\n/g, " ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Donate button */}
        <div className="text-center">
          <motion.a
            href={campaignUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 4px 6px rgba(220, 38, 38, 0.2)",
                "0 8px 15px rgba(220, 38, 38, 0.4)",
                "0 4px 6px rgba(220, 38, 38, 0.2)",
              ],
            }}
            transition={{
              boxShadow: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
              },
            }}
          >
            Donate Now
          </motion.a>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Help us build a future rooted in God, freedom, and responsibility.
          </p>
        </div>
      </div>

      {/* Full description modal */}
      {showFullDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">BigBased Fundraising Campaign</h3>
              <button
                onClick={() => setShowFullDescription(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
              <div className="prose dark:prose-invert max-w-none">
                {fullDescription.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => setShowFullDescription(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <a
                href={campaignUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                Donate Now <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Edit share message modal */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                Edit {currentPlatform.charAt(0).toUpperCase() + currentPlatform.slice(1)} Message
              </h3>
              <button
                onClick={() => {
                  setEditingMessage(false)
                  setCurrentPlatform("")
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                defaultValue={shareMessagesRef.current[currentPlatform]}
                placeholder={`Enter your custom ${currentPlatform} message here...`}
                id="shareMessageEditor"
              />

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {currentPlatform === "twitter" && "Max 280 characters recommended for Twitter."}
                {currentPlatform === "email" && "You can use 'Subject: Your Subject\n\nYour email body' format."}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingMessage(false)
                  setCurrentPlatform("")
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const textarea = document.getElementById("shareMessageEditor") as HTMLTextAreaElement
                  updateShareMessage(textarea.value)
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
