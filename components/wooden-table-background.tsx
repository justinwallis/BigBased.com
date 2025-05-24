"use client"
import { useEffect, useState } from "react"

export default function WoodenTableBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Wooden table surface with perspective */}
      <div className="absolute inset-0">
        {/* Table top (visible edge) */}
        <div
          className="absolute top-0 left-0 right-0 h-32 transform-gpu"
          style={{
            background: `
              linear-gradient(180deg, 
                #8B4513 0%, 
                #A0522D 20%, 
                #CD853F 40%, 
                #D2691E 60%, 
                #8B4513 80%, 
                #654321 100%
              )
            `,
            transform: "perspective(800px) rotateX(75deg)",
            transformOrigin: "top center",
          }}
        >
          {/* Wood grain texture */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  rgba(0,0,0,0.1) 1px,
                  transparent 2px,
                  transparent 8px
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  rgba(0,0,0,0.05) 1px,
                  transparent 2px,
                  transparent 20px
                )
              `,
            }}
          />
        </div>

        {/* Table front face */}
        <div
          className="absolute top-20 left-0 right-0 bottom-0"
          style={{
            background: `
              linear-gradient(180deg, 
                #654321 0%, 
                #8B4513 20%, 
                #A0522D 40%, 
                #8B4513 60%, 
                #654321 80%, 
                #4A4A4A 100%
              )
            `,
          }}
        >
          {/* Vertical wood grain */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  rgba(0,0,0,0.2) 1px,
                  transparent 2px,
                  transparent 12px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  rgba(0,0,0,0.1) 1px,
                  transparent 2px,
                  transparent 40px
                )
              `,
            }}
          />
        </div>
      </div>

      {/* Candle on the table */}
      <div className="absolute top-8 right-16 transform-gpu" style={{ transform: "perspective(800px) rotateX(75deg)" }}>
        {/* Candle base */}
        <div className="relative">
          {/* Candle holder */}
          <div
            className="w-8 h-3 rounded-full bg-gradient-to-b from-yellow-600 to-yellow-800 shadow-lg"
            style={{ transform: "rotateX(-75deg)" }}
          />

          {/* Candle */}
          <div
            className="w-3 h-12 bg-gradient-to-b from-cream to-yellow-100 rounded-t-sm mx-auto -mt-1 shadow-md"
            style={{ transform: "rotateX(-75deg)" }}
          />

          {/* Flame */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div
              className="w-2 h-4 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-pulse opacity-90"
              style={{ animationDuration: "1.5s" }}
            />
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gradient-to-t from-red-400 to-orange-300 rounded-full animate-bounce"
              style={{ animationDuration: "2s" }}
            />
          </div>

          {/* Flickering light effect */}
          <div
            className="absolute -top-8 -left-8 w-16 h-16 rounded-full opacity-20 animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255,165,0,0.6) 0%, rgba(255,140,0,0.3) 40%, transparent 70%)",
              animationDuration: "2.5s",
            }}
          />
        </div>
      </div>

      {/* Old books on table */}
      <div className="absolute top-6 left-12 transform-gpu" style={{ transform: "perspective(800px) rotateX(75deg)" }}>
        <div className="flex space-x-1">
          {/* Book 1 */}
          <div
            className="w-16 h-2 bg-gradient-to-r from-red-800 to-red-900 shadow-md"
            style={{ transform: "rotateX(-75deg)" }}
          />
          {/* Book 2 */}
          <div
            className="w-12 h-2 bg-gradient-to-r from-green-800 to-green-900 shadow-md"
            style={{ transform: "rotateX(-75deg)" }}
          />
          {/* Book 3 */}
          <div
            className="w-14 h-2 bg-gradient-to-r from-blue-800 to-blue-900 shadow-md"
            style={{ transform: "rotateX(-75deg)" }}
          />
        </div>
      </div>

      {/* Scattered papers */}
      <div
        className="absolute top-10 left-1/3 transform-gpu"
        style={{ transform: "perspective(800px) rotateX(75deg)" }}
      >
        <div
          className="w-20 h-1 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-sm opacity-80 animate-pulse"
          style={{
            transform: "rotateX(-75deg) rotateZ(15deg)",
            animationDuration: "4s",
          }}
        />
      </div>

      {/* Ambient lighting overlay */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: `
            radial-gradient(ellipse at 85% 15%, rgba(255,165,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(139,69,19,0.1) 0%, transparent 70%)
          `,
          animationDuration: "3s",
        }}
      />

      {/* Dark mode enhancements */}
      <div className="absolute inset-0 dark:block hidden">
        {/* Enhanced candlelight in dark mode */}
        <div
          className="absolute top-0 right-8 w-32 h-32 rounded-full opacity-30 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(255,165,0,0.4) 0%, rgba(255,140,0,0.2) 40%, transparent 70%)",
            animationDuration: "2s",
          }}
        />

        {/* Darker wood tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 opacity-60" />
      </div>
    </div>
  )
}
