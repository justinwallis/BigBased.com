"use client"

import { useId, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FAQItem } from "@/data/faq-data"

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string | null
  description?: string | null
  categories?: string[]
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description,
  categories,
}: FAQSectionProps) {
  const showIntro = Boolean(title || description)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const answerIdPrefix = useId()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const filteredFaqs = activeCategory ? faqs.filter((faq) => faq.category === activeCategory) : faqs

  const chooseCategory = (category: string | null) => {
    setActiveCategory(category)
    setActiveIndex(null) // A filtered index cannot safely remain selected after switching categories.
  }

  return (
    <div className={"bb-2025-container w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 " + (showIntro ? "py-12" : "pb-8")}>
      {showIntro && (
        <div className="mb-8 text-center">
          {title && <h2 className="mb-4 text-2xl font-bold">{title}</h2>}
          {description && <p className="bb-2025-dim text-base">{description}</p>}
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="bb-2025-tabs flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => chooseCategory(null)}
            aria-pressed={activeCategory === null}
            className={`bb-2025-tab text-sm transition-colors ${
              activeCategory === null
                ? "text-amber-600 dark:text-amber-400"
                : "bb-2025-dim"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => chooseCategory(category)}
              aria-pressed={activeCategory === category}
              className={`bb-2025-tab text-sm capitalize transition-colors ${
                activeCategory === category
                  ? "text-amber-600 dark:text-amber-400"
                  : "bb-2025-dim"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="bb-2025-panel overflow-hidden transition-colors duration-200"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="flex justify-between items-center w-full px-5 py-4 text-left hover:bg-gray-100 dark:hover:bg-[#131313] transition-colors"
              aria-expanded={activeIndex === index}
              aria-controls={`${answerIdPrefix}-${index}`}
            >
              <span className="text-base font-medium">{faq.question}</span>
              <span className="ml-6 flex-shrink-0">
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </span>
            </button>
            <div
              id={`${answerIdPrefix}-${index}`}
              hidden={activeIndex !== index}
              className="px-5 pb-4"
            >
              <p className="bb-2025-dim whitespace-pre-line">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
