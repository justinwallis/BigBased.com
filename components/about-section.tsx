"use client"
import { useState, useEffect, useRef } from "react"
import { InteractiveLearningCenter } from "./interactive-learning-center"

export function AboutSection() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const quotes = [
    { text: "Freedom is never more than one generation away from extinction.", author: "Ronald Reagan" },
    {
      text: "The nine most terrifying words in the English language are: I'm from the Government, and I'm here to help.",
      author: "Ronald Reagan",
    },
    {
      text: "The problem with socialism is that you eventually run out of other people's money.",
      author: "Margaret Thatcher",
    },
    {
      text: "In this present crisis, government is not the solution to our problem, government is the problem.",
      author: "Ronald Reagan",
    },
    {
      text: "I would rather be exposed to the inconveniences attending too much liberty than those attending too small a degree of it.",
      author: "Thomas Jefferson",
    },
    {
      text: "The tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.",
      author: "Thomas Jefferson",
    },
    { text: "Government's first duty is to protect the people, not run their lives.", author: "Ronald Reagan" },
    { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
    {
      text: "A government big enough to give you everything you want is strong enough to take everything you have.",
      author: "Thomas Jefferson",
    },
    {
      text: "The Constitution is not an instrument for the government to restrain the people, it is an instrument for the people to restrain the government.",
      author: "Patrick Henry",
    },
    { text: "Give me liberty, or give me death!", author: "Patrick Henry" },
    {
      text: "We must reject the idea that every time a law's broken, society is guilty rather than the lawbreaker.",
      author: "Ronald Reagan",
    },
  ]

  useEffect(() => {
    // Set up the rotation interval
    intervalRef.current = setInterval(() => {
      // Start fade out
      setIsVisible(false)

      // After fade out completes, change quote and fade in
      timeoutRef.current = setTimeout(() => {
        const nextQuote = Math.floor(Math.random() * quotes.length)
        setCurrentQuote(nextQuote)
        setIsVisible(true)
      }, 500) // This should match the CSS transition duration
    }, 8000) // Change quote every 8 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [quotes.length])

  return (
    <section className="pt-6 pb-2 bg-gray-50 dark:bg-gray-900 about-section">
      <div className="container mx-auto px-3 md:px-4">
        {/* Doubled the top padding in the title area */}
        <div className="text-center mb-3 pt-6 pb-3">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">About Big Based</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm">
            Big Based represents the convergence of Political, Religious, and Technological transformation.
          </p>
        </div>

        {/* Reduced padding and spacing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow pt-0 pb-2 px-2 md:pb-3 md:px-3 border border-gray-100 dark:border-gray-700 mt-2">
          <InteractiveLearningCenter />
        </div>

        <div className="mt-6 pt-4 text-center">
          <div
            className="quote-container h-16 flex items-center justify-center"
            style={{
              transition: "opacity 0.5s ease-in-out",
              opacity: isVisible ? 1 : 0,
            }}
          >
            <p className="text-gray-600 dark:text-gray-400 italic text-sm max-w-2xl mx-auto">
              "{quotes[currentQuote].text}" - <span className="font-semibold">{quotes[currentQuote].author}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
