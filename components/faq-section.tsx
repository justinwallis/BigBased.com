"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FAQItem } from "@/data/faq-data"

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
  description?: string
  categories?: string[]
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description,
  categories,
}: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const filteredFaqs = activeCategory ? faqs.filter((faq) => faq.category === activeCategory) : faqs

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        {description && <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>}
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeCategory === category
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="flex justify-between items-center w-full px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={activeIndex === index}
            >
              <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
              <span className="ml-6 flex-shrink-0">
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </span>
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? "max-h-96 py-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
