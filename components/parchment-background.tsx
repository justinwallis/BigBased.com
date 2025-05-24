"use client"

export default function ParchmentBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Base parchment layer */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(244, 241, 232, 0.9) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(240, 234, 214, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 20% 70%, rgba(237, 228, 209, 0.7) 0%, transparent 50%),
            linear-gradient(45deg, #f4f1e8 0%, #f0ead6 25%, #ede4d1 50%, #e8dcc0 75%, #e3d5b7 100%)
          `,
        }}
      />

      {/* Animated age spots */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              backgroundColor: "rgba(139, 115, 85, 0.3)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.1) 2px,
              rgba(139, 115, 85, 0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.05) 2px,
              rgba(139, 115, 85, 0.05) 4px
            )
          `,
        }}
      />

      {/* Subtle movement overlay */}
      <div className="absolute inset-0 animate-pulse opacity-20" style={{ animationDuration: "4s" }}>
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse at 40% 30%, rgba(139, 115, 85, 0.1) 0%, transparent 70%),
              radial-gradient(ellipse at 60% 70%, rgba(160, 140, 115, 0.1) 0%, transparent 70%)
            `,
          }}
        />
      </div>
    </div>
  )
}
