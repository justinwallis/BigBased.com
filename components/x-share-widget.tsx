"use client"

import { useState, useRef, useEffect } from "react"
import { Share, XIcon, ImageIcon, Sparkles, Copy, Download, Info, Hash } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import Script from "next/script"

// Gallery of images users can choose from
const tweetImages = [
  {
    id: 1,
    src: "/based-ai-promo.png",
    alt: "BASED AI Promotional Image",
  },
  {
    id: 2,
    src: "/digital-sovereignty.png",
    alt: "Digital Sovereignty",
  },
  {
    id: 3,
    src: "/cultural-decay.png",
    alt: "Cultural Decay",
  },
  {
    id: 4,
    src: "/truth-archives.png",
    alt: "Truth Archives",
  },
  {
    id: 5,
    src: "/parallel-economy.png",
    alt: "Parallel Economy",
  },
  {
    id: 6,
    src: "/dove-spread-wings.png",
    alt: "Freedom Symbol",
  },
]

// Suggested hashtags
const suggestedHashtags = [
  "BigBased",
  "BasedAI",
  "DigitalSovereignty",
  "FaithTech",
  "TruthNetwork",
  "ParallelEconomy",
  "CultureWar",
  "FreeSpeech",
  "AlternativeTech",
  "ChristianTech",
  "ConservativeTech",
  "DecentralizedWeb",
]

export default function XShareWidget() {
  const { theme } = useTheme()
  const [message, setMessage] = useState(
    "They are building BASED AI!!! Check out this site https://BigBased.com #BigBased",
  )
  const [charCount, setCharCount] = useState(message.length)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [selectedImage, setSelectedImage] = useState(tweetImages[0])
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [showSparkle, setShowSparkle] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [imageDownloaded, setImageDownloaded] = useState(false)
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false)
  const [selectedHashtags, setSelectedHashtags] = useState(["BigBased"])
  const [twitterWidgetLoaded, setTwitterWidgetLoaded] = useState(false)
  const textareaRef = useRef(null)
  const galleryRef = useRef(null)
  const hashtagsRef = useRef(null)
  const twitterTimelineRef = useRef(null)
  const maxChars = 280

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Close gallery when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (galleryRef.current && !galleryRef.current.contains(event.target)) {
        setShowImageGallery(false)
      }
      if (hashtagsRef.current && !hashtagsRef.current.contains(event.target)) {
        setShowHashtagSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [galleryRef, hashtagsRef])

  // Show sparkle animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkle(true)
      setTimeout(() => setShowSparkle(false), 1500)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  // Initialize Twitter widget when script is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.twttr && twitterWidgetLoaded) {
      if (twitterTimelineRef.current) {
        // Clear any existing content
        twitterTimelineRef.current.innerHTML = ""

        // Create the Twitter timeline
        window.twttr.widgets
          .createTimeline(
            {
              sourceType: "search",
              search: "#BigBased",
            },
            twitterTimelineRef.current,
            {
              height: 600,
              chrome: "noheader, nofooter, noborders",
              theme: theme === "dark" ? "dark" : "light",
            },
          )
          .then(() => {
            console.log("Twitter timeline loaded successfully")
          })
          .catch((err) => {
            console.error("Error loading Twitter timeline:", err)
          })
      }
    }
  }, [twitterWidgetLoaded, theme])

  // Handle Twitter widget script loading
  const handleTwitterScriptLoad = () => {
    setTwitterWidgetLoaded(true)
  }

  const handleMessageChange = (e) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    setCharCount(newMessage.length)
  }

  const shareOnX = () => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://x.com/intent/tweet?text=${encodedMessage}`, "_blank")
    setShared(true)
    setShowSparkle(true)

    // Reset shared status after 3 seconds
    setTimeout(() => {
      setShared(false)
      setShowSparkle(false)
    }, 3000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const toggleImageGallery = () => {
    setShowImageGallery(!showImageGallery)
    setShowHashtagSuggestions(false)
  }

  const toggleHashtagSuggestions = () => {
    setShowHashtagSuggestions(!showHashtagSuggestions)
    setShowImageGallery(false)
  }

  const selectImage = (image) => {
    setSelectedImage(image)
    setShowImageGallery(false)
    setShowSparkle(true)
    setImageDownloaded(false)
    setTimeout(() => setShowSparkle(false), 1500)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImageDownloaded(false)
  }

  const downloadImage = () => {
    if (!selectedImage) return

    // Create a link element
    const link = document.createElement("a")
    link.href = selectedImage.src
    link.download = `bigbased-${selectedImage.alt.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setImageDownloaded(true)
    setTimeout(() => {
      setImageDownloaded(false)
    }, 3000)
  }

  const addHashtag = (hashtag) => {
    if (!selectedHashtags.includes(hashtag)) {
      setSelectedHashtags([...selectedHashtags, hashtag])

      // Add the hashtag to the message if it's not already there
      if (!message.includes(`#${hashtag}`)) {
        setMessage((prevMessage) => {
          const newMessage = `${prevMessage} #${hashtag}`
          setCharCount(newMessage.length)
          return newMessage
        })
      }
    }
  }

  const removeHashtag = (hashtag) => {
    setSelectedHashtags(selectedHashtags.filter((h) => h !== hashtag))

    // Remove the hashtag from the message
    setMessage((prevMessage) => {
      const newMessage = prevMessage.replace(` #${hashtag}`, "")
      setCharCount(newMessage.length)
      return newMessage
    })
  }

  // Determine if we're in dark mode
  const isDarkMode = theme === "dark"

  return (
    <section
      className={`py-8 px-4 ${isDarkMode ? "bg-gray-900" : "bg-white"} border-t border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"} relative overflow-hidden`}
    >
      {/* Twitter Widget Script */}
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" onLoad={handleTwitterScriptLoad} />

      {/* Sparkle animation */}
      {showSparkle && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-ping">
            <Sparkles className="text-yellow-400 h-6 w-6" />
          </div>
          <div className="absolute top-1/3 right-1/3 animate-ping delay-100">
            <Sparkles className="text-blue-400 h-5 w-5" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-ping delay-200">
            <Sparkles className="text-purple-400 h-7 w-7" />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full ${isDarkMode ? "bg-white" : "bg-black"} flex items-center justify-center mr-3`}
            >
              <XIcon size={16} className={isDarkMode ? "text-black" : "text-white"} />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Share & Connect on X</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Post Composer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Compose Your Post</h4>

              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Info size={16} />
                </button>

                {showTooltip && (
                  <div className="absolute right-0 w-64 p-2 mt-2 text-xs bg-black text-white rounded shadow-lg z-10">
                    X doesn't allow direct image uploads via sharing. Download the image first, then attach it after X
                    opens.
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"} rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                className={`w-full bg-transparent border-none resize-none focus:ring-0 ${
                  isDarkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"
                } min-h-[80px]`}
                placeholder="What would you like to share?"
                maxLength={maxChars}
              />

              {selectedImage && (
                <div
                  className={`relative mt-2 mb-3 rounded-xl overflow-hidden border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } group`}
                >
                  <div className="absolute top-2 right-2 z-10 flex space-x-2">
                    <button
                      onClick={downloadImage}
                      className="bg-black bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition-all"
                      aria-label="Download image"
                      title="Download image to attach to your tweet"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={toggleImageGallery}
                      className="bg-black bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition-all"
                      aria-label="Change image"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button
                      onClick={removeImage}
                      className="bg-black bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition-all"
                      aria-label="Remove image"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src={selectedImage.src || "/placeholder.svg"}
                      alt={selectedImage.alt}
                      width={600}
                      height={800}
                      className="max-h-[400px] w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              )}

              {/* Hashtag Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedHashtags.map((hashtag) => (
                  <div
                    key={hashtag}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
                      isDarkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <Hash size={14} className="mr-1" />
                    {hashtag}
                    <button
                      onClick={() => removeHashtag(hashtag)}
                      className="ml-1.5 text-opacity-70 hover:text-opacity-100"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={toggleHashtagSuggestions}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Hash size={14} className="mr-1" />
                  Add Hashtag
                </button>
              </div>

              {/* Hashtag Suggestions */}
              {showHashtagSuggestions && (
                <div
                  ref={hashtagsRef}
                  className={`mt-2 mb-3 p-3 ${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                  } rounded-xl border shadow-lg`}
                >
                  <div className={`mb-2 pb-2 border-b ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Suggested Hashtags
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHashtags
                      .filter((h) => !selectedHashtags.includes(h))
                      .map((hashtag) => (
                        <button
                          key={hashtag}
                          onClick={() => addHashtag(hashtag)}
                          className={`px-2.5 py-1 rounded-full text-sm ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-300 hover:bg-gray-900"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          #{hashtag}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {showImageGallery && (
                <div
                  ref={galleryRef}
                  className={`mt-3 p-3 ${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                  } rounded-xl border shadow-lg`}
                >
                  <div className={`mb-2 pb-2 border-b ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <h4 className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Select an image for your post
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {tweetImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                          selectedImage?.id === image.id ? "ring-2 ring-blue-500" : "hover:opacity-90"
                        }`}
                        onClick={() => selectImage(image)}
                      >
                        <Image
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          width={120}
                          height={90}
                          className="w-full h-20 object-cover"
                        />
                        {selectedImage?.id === image.id && (
                          <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3 h-3 text-white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedImage && !showHashtagSuggestions && !showImageGallery && (
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={toggleImageGallery}
                    className={`flex items-center px-3 py-1.5 text-sm ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } rounded-lg transition-colors`}
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Add Image
                  </button>

                  <button
                    onClick={toggleHashtagSuggestions}
                    className={`flex items-center px-3 py-1.5 text-sm ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } rounded-lg transition-colors`}
                  >
                    <Hash size={16} className="mr-2" />
                    Add Hashtags
                  </button>
                </div>
              )}

              {selectedImage && (
                <div
                  className={`mt-2 mb-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center`}
                >
                  <Info size={12} className="mr-1 flex-shrink-0" />
                  <span>
                    {imageDownloaded
                      ? "Image downloaded! Attach it after X opens."
                      : "Download the image first, then attach it to your tweet after X opens."}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div
                  className={`text-sm ${
                    charCount > maxChars - 20 ? "text-orange-500" : isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {maxChars - charCount} characters remaining
                </div>

                <div className="flex space-x-2">
                  {selectedImage && !imageDownloaded && (
                    <button
                      onClick={downloadImage}
                      className={`px-3 py-1 text-sm ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      } rounded-full transition-colors flex items-center`}
                    >
                      <Download size={14} className="mr-1" />
                      Download Image
                    </button>
                  )}

                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1 text-sm ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } rounded-full transition-colors flex items-center`}
                  >
                    <Copy size={14} className="mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={shareOnX}
                    className={`px-4 py-1 text-sm ${
                      isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                    } rounded-full transition-colors flex items-center ${shared ? "animate-pulse" : ""}`}
                  >
                    <Share size={14} className="mr-1" />
                    {shared ? "Shared!" : "Share"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Live #BigBased Feed</h4>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              } rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[600px]`}
            >
              {/* Twitter Timeline Container */}
              <div ref={twitterTimelineRef} className="w-full h-full min-h-[600px]">
                {/* Loading state while Twitter widget loads */}
                {!twitterWidgetLoaded && (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Loading live tweets...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-center">
              <a
                href="https://x.com/hashtag/BigBased"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm ${
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-1"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
                View all #BigBased posts on X
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
