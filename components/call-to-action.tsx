"use client"

import Link from "next/link"
import { useState } from "react"
import DigitalCross from "./digital-cross"
import Image from "next/image"

export default function CallToAction() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-24 px-8 md:px-16 relative overflow-hidden">
      {/* Digital cross background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[90%] h-[90%] digital-cross-pulse">
          {/* Light mode cross */}
          <div className="block dark:hidden w-full h-full">
            <DigitalCross />
          </div>
          {/* Dark mode cross - sized to match light mode exactly */}
          <div className="hidden dark:block w-full h-full relative">
            <Image
              src="/digitalcrossInvert.png"
              alt="Digital Cross"
              fill
              style={{ objectFit: "contain" }}
              priority
              className="opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Binary code background */}
      <div className="binary-background absolute inset-0 opacity-10 select-none pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="binary-row" style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}>
            {Array.from({ length: 10 }).map((_, j) => (
              <span
                key={j}
                className="inline-block mx-1 text-gray-400 dark:text-gray-500 opacity-50"
                style={{ animationDelay: `${j * 0.05}s` }}
              >
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-black dark:text-white text-shadow-sm">
          Embrace a Future
          <br />
          Rooted in God, Freedom,
          <br />
          and Responsibility.
        </h2>
        <p className="text-lg mb-12 max-w-3xl mx-auto text-black dark:text-gray-200 text-shadow-sm">
          From complacency to conviction, from mediocrity to excellence—the transformation is possible for anyone
          willing to take the step. The tools, the truth, and the blueprint are all here. The only question is: Are you
          ready to join us?
        </p>
        <Link
          href="/join"
          className={`inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-medium text-lg relative overflow-hidden transition-all duration-300 ${isHovered ? "transform scale-105" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="relative z-10">Join the Revolution</span>
          {isHovered && (
            <span className="absolute inset-0 bg-black dark:bg-white">
              <span className="absolute inset-0 binary-pulse opacity-30"></span>
            </span>
          )}
        </Link>
      </div>
    </section>
  )
}
