"use client"

import { useEffect, useState } from "react"

export default function DigitalLandscape() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {/* Debug background to see if component is rendering */}
      <div className="absolute inset-0 bg-green-900/10" />

      {/* Clouds */}
      <div className="absolute top-0 left-0 w-full h-1/3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${i * 20 + 10}%`,
              top: `${20 + i * 10}%`,
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Hills */}
      <div className="absolute bottom-0 left-0 w-full h-2/3">
        {/* Back hill */}
        <div
          className="absolute bottom-0 w-full bg-green-800/30"
          style={{
            height: "40%",
            clipPath: "polygon(0 60%, 20% 40%, 40% 50%, 60% 30%, 80% 45%, 100% 35%, 100% 100%, 0 100%)",
          }}
        />

        {/* Middle hill */}
        <div
          className="absolute bottom-0 w-full bg-green-700/40"
          style={{
            height: "30%",
            clipPath: "polygon(0 70%, 25% 50%, 50% 60%, 75% 40%, 100% 55%, 100% 100%, 0 100%)",
          }}
        />

        {/* Front hill */}
        <div
          className="absolute bottom-0 w-full bg-green-600/50"
          style={{
            height: "20%",
            clipPath: "polygon(0 80%, 30% 60%, 60% 70%, 90% 50%, 100% 65%, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Grass */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-green-400/60 animate-pulse"
            style={{
              left: `${i * 2}%`,
              width: "2px",
              height: `${15 + Math.random() * 20}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: "2s",
              transform: `rotate(${-5 + Math.random() * 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating particles for extra effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: "4px",
              height: "4px",
              animationDelay: `${i * 0.3}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
