"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react"

interface VideoPlayerProps {
  src: string
  title: string
  poster?: string
}

export function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  // Handle time update
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const seekTime = (Number.parseFloat(e.target.value) / 100) * duration
    video.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // For development environment, use a placeholder image if the poster is not available
  const posterUrl = poster?.startsWith("/placeholder.svg") ? poster : poster || "/video-thumbnail.png"

  return (
    <div className="relative group">
      {/* Video element */}
      <video ref={videoRef} className="w-full h-auto bg-black" poster={posterUrl} preload="metadata">
        {/* Use a placeholder video source for development */}
        <source src={src || "https://example.com/placeholder-video.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video overlay for poster image */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div
            className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <Play size={32} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white ${progress}%, gray ${progress}%)`,
          }}
        />

        {/* Controls row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            {/* Play/Pause button */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Skip backward */}
            <button onClick={() => skip(-10)} className="text-white hover:text-gray-300">
              <SkipBack size={20} />
            </button>

            {/* Skip forward */}
            <button onClick={() => skip(10)} className="text-white hover:text-gray-300">
              <SkipForward size={20} />
            </button>

            {/* Volume button */}
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Time display */}
            <span className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen button */}
          <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
