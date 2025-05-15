"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Award, RefreshCw, Share2 } from "lucide-react"
import { useTheme } from "next-themes"

// Quiz questions and answers
const quizQuestions = [
  {
    question: "What's your primary concern about today's digital landscape?",
    answers: [
      {
        text: "Privacy invasion by big tech companies",
        score: 3,
        feedback: "Privacy concerns are a key aspect of digital sovereignty.",
      },
      {
        text: "Government censorship and overreach",
        score: 4,
        feedback: "Recognizing government overreach shows awareness of freedom threats.",
      },
      {
        text: "The spread of misinformation online",
        score: 2,
        feedback: "Concern for truth is important, though the source of 'misinformation' matters.",
      },
      {
        text: "I don't have any major concerns",
        score: 0,
        feedback: "Being aware of digital threats is the first step toward sovereignty.",
      },
    ],
  },
  {
    question: "How do you primarily get your news and information?",
    answers: [
      {
        text: "Mainstream media outlets (CNN, Fox, MSNBC, etc.)",
        score: 1,
        feedback: "Mainstream sources often present limited perspectives.",
      },
      {
        text: "Independent journalists and alternative media",
        score: 4,
        feedback: "Independent sources often provide perspectives outside the mainstream narrative.",
      },
      {
        text: "Social media feeds and trending topics",
        score: 2,
        feedback: "Social media can be useful but is often subject to algorithmic manipulation.",
      },
      {
        text: "A mix of sources that I carefully evaluate",
        score: 3,
        feedback: "Critical evaluation of multiple sources is a strong approach.",
      },
    ],
  },
  {
    question: "Which of these values is most important to you personally?",
    answers: [
      {
        text: "Individual freedom and personal responsibility",
        score: 4,
        feedback: "These are foundational values for a free society.",
      },
      {
        text: "Community safety and collective well-being",
        score: 2,
        feedback: "Community is important, though not at the expense of individual rights.",
      },
      {
        text: "Technological progress and innovation",
        score: 3,
        feedback: "Innovation is crucial, especially when aligned with human freedom.",
      },
      {
        text: "Social justice and equality of outcomes",
        score: 1,
        feedback: "Equality of opportunity rather than outcomes better preserves freedom.",
      },
    ],
  },
  {
    question: "What role should faith and traditional values play in society?",
    answers: [
      {
        text: "They're outdated concepts that impede progress",
        score: 0,
        feedback: "Traditional values often contain wisdom refined over generations.",
      },
      {
        text: "They're personal matters that should remain private",
        score: 2,
        feedback: "Faith can provide both personal and community benefits.",
      },
      {
        text: "They provide important moral foundations for society",
        score: 4,
        feedback: "Strong moral foundations are essential for a healthy society.",
      },
      {
        text: "They're useful as cultural traditions but not as guides",
        score: 1,
        feedback: "Faith and tradition offer more than cultural artifacts.",
      },
    ],
  },
  {
    question: "How do you feel about digital currency and financial sovereignty?",
    answers: [
      {
        text: "I prefer traditional banking and established systems",
        score: 1,
        feedback: "Traditional systems are increasingly subject to control and surveillance.",
      },
      {
        text: "I'm interested in cryptocurrencies as investments",
        score: 2,
        feedback: "Beyond investment, crypto offers freedom from centralized control.",
      },
      {
        text: "I believe in decentralized finance and monetary freedom",
        score: 4,
        feedback: "Financial sovereignty is a crucial component of personal freedom.",
      },
      {
        text: "I support central bank digital currencies (CBDCs)",
        score: 0,
        feedback: "CBDCs often increase government control over personal finances.",
      },
    ],
  },
  {
    question: "What's your approach to personal data and online privacy?",
    answers: [
      {
        text: "I freely share information for convenience and services",
        score: 0,
        feedback: "Convenience often comes at the cost of privacy and freedom.",
      },
      {
        text: "I'm cautious but use mainstream platforms with privacy settings",
        score: 2,
        feedback: "Privacy settings on mainstream platforms offer limited protection.",
      },
      {
        text: "I use privacy tools, encrypted services, and limit data sharing",
        score: 4,
        feedback: "Taking active measures to protect privacy is increasingly important.",
      },
      {
        text: "I'm concerned but don't know how to protect my data effectively",
        score: 1,
        feedback: "Awareness is the first step toward better privacy practices.",
      },
    ],
  },
  {
    question: "How do you view the relationship between technology and human freedom?",
    answers: [
      {
        text: "Technology inherently increases human freedom and potential",
        score: 2,
        feedback: "Technology can enhance freedom but can also be used for control.",
      },
      {
        text: "Technology is neutral; its impact depends on how we use it",
        score: 3,
        feedback: "The design and implementation of technology often reflect values.",
      },
      {
        text: "Modern technology increasingly threatens freedom and autonomy",
        score: 4,
        feedback: "Recognizing technology's potential for control is important.",
      },
      {
        text: "I don't think much about technology's broader implications",
        score: 0,
        feedback: "Understanding technology's impact is crucial in the digital age.",
      },
    ],
  },
]

// Results categories based on score ranges
const resultCategories = [
  {
    range: [0, 7],
    title: "Digital Novice",
    description:
      "You're just beginning your journey toward digital sovereignty and awareness. There's much to learn about the importance of freedom, faith, and truth in the digital age.",
    recommendations: [
      "Explore our Digital Library for foundational resources",
      "Join our community to connect with like-minded individuals",
      "Subscribe to our newsletter for regular insights",
    ],
  },
  {
    range: [8, 14],
    title: "Awakening Sovereign",
    description:
      "You're becoming aware of the challenges to freedom and truth in our digital world. You're taking steps toward greater sovereignty but have room to grow.",
    recommendations: [
      "Dive deeper into our resources on digital privacy",
      "Consider alternatives to mainstream platforms and services",
      "Explore our content on the parallel economy",
    ],
  },
  {
    range: [15, 21],
    title: "Freedom Advocate",
    description:
      "You have a solid understanding of the importance of digital sovereignty and traditional values. You actively seek truth and value freedom in your digital life.",
    recommendations: [
      "Engage with our advanced resources on decentralized systems",
      "Share your knowledge with others in your community",
      "Explore ways to contribute to the parallel economy",
    ],
  },
  {
    range: [22, 28],
    title: "Based Champion",
    description:
      "You exemplify the principles of being Based! Your commitment to freedom, faith, and truth positions you as a leader in the movement toward a more sovereign digital future.",
    recommendations: [
      "Consider becoming a community leader or contributor",
      "Explore partnership opportunities with Big Based",
      "Help others in their journey toward digital sovereignty",
    ],
  },
]

export default function BasedQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [result, setResult] = useState<(typeof resultCategories)[0] | null>(null)
  const [animateProgress, setAnimateProgress] = useState(false)
  const { theme } = useTheme()

  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) / quizQuestions.length) * 100

  // Determine result category based on final score
  useEffect(() => {
    if (quizComplete) {
      const category = resultCategories.find((cat) => score >= cat.range[0] && score <= cat.range[1])
      setResult(category || resultCategories[0])
    }
  }, [quizComplete, score])

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Prevent changing answer after selection

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)
    setScore((prev) => prev + quizQuestions[currentQuestion].answers[answerIndex].score)

    // Animate progress bar
    setAnimateProgress(true)
    setTimeout(() => setAnimateProgress(false), 600)
  }

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    setShowFeedback(false)
    setSelectedAnswer(null)

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setQuizComplete(true)
    }
  }

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setQuizComplete(false)
    setResult(null)
  }

  // Get background color based on score (for answer feedback)
  const getScoreColor = (score: number) => {
    if (score >= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score >= 1) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How Based Are You?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take this quiz to discover where you stand on the path to digital sovereignty, truth, and freedom.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700">
            <div
              className={`h-full bg-black dark:bg-white transition-all duration-500 ${
                animateProgress ? "ease-out" : "ease-in-out"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!quizComplete ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Score: {score}/{quizQuestions.length * 4}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                      {quizQuestions[currentQuestion].question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].answers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          selectedAnswer === index
                            ? "border-black dark:border-white ring-2 ring-black dark:ring-white"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        } ${
                          selectedAnswer === null
                            ? "bg-white dark:bg-gray-800"
                            : selectedAnswer === index
                              ? "bg-gray-50 dark:bg-gray-700"
                              : "bg-white dark:bg-gray-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border ${
                              selectedAnswer === index
                                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                                : "border-gray-300 dark:border-gray-600"
                            } flex items-center justify-center mr-3 mt-0.5`}
                          >
                            {selectedAnswer === index && <Check size={14} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{answer.text}</p>

                            {/* Show feedback when answer is selected */}
                            {selectedAnswer === index && showFeedback && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2"
                              >
                                <div className={`text-sm p-2 rounded ${getScoreColor(answer.score)}`}>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-2">+{answer.score} points</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                                      {answer.score === 4
                                        ? "Excellent"
                                        : answer.score === 3
                                          ? "Good"
                                          : answer.score === 2
                                            ? "Fair"
                                            : answer.score === 1
                                              ? "Basic"
                                              : "Limited"}
                                    </span>
                                  </div>
                                  <p className="mt-1">{answer.feedback}</p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Next button */}
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex justify-end"
                    >
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                      >
                        {currentQuestion < quizQuestions.length - 1 ? (
                          <>
                            Next Question <ChevronRight size={18} className="ml-1" />
                          </>
                        ) : (
                          "See Results"
                        )}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black dark:bg-white mb-6">
                      <Award size={48} className="text-white dark:text-black" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {result?.title}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium">
                        Score: {score}/{quizQuestions.length * 4}
                      </div>
                    </div>

                    {/* Score visualization */}
                    <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
                      <div
                        className="h-full bg-black dark:bg-white transition-all duration-1000 ease-out"
                        style={{ width: `${(score / (quizQuestions.length * 4)) * 100}%` }}
                      ></div>
                      {/* Score markers */}
                      {resultCategories.map((cat, index) => (
                        <div
                          key={index}
                          className="absolute top-0 h-full w-px bg-gray-300 dark:bg-gray-500"
                          style={{
                            left: `${(cat.range[1] / (quizQuestions.length * 4)) * 100}%`,
                            display: index < resultCategories.length - 1 ? "block" : "none",
                          }}
                        >
                          <div className="absolute -top-6 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {cat.title}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                      {result?.description}
                    </div>
                  </div>

                  {/* Detailed analysis */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                    <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Your Detailed Analysis</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Strengths</h5>
                          <ul className="space-y-2">
                            {result?.range[1] > 14 ? (
                              <>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                                    <Check size={12} className="text-white" />
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Strong understanding of digital sovereignty
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                                    <Check size={12} className="text-white" />
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Values personal freedom and responsibility
                                  </span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                                    <Check size={12} className="text-white" />
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Beginning to question mainstream narratives
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                                    <Check size={12} className="text-white" />
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Open to exploring alternative perspectives
                                  </span>
                                </li>
                              </>
                            )}
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-0.5">
                                <Check size={12} className="text-white" />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">
                                {score > 20
                                  ? "Leading by example in your community"
                                  : "Seeking truth beyond surface-level information"}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Areas for Growth</h5>
                          <ul className="space-y-2">
                            {score < 21 ? (
                              <>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Deepen understanding of digital privacy tools
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Explore alternative platforms and services
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Consider the role of traditional values in modern society
                                  </span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Help others understand digital sovereignty
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Build and support parallel economy initiatives
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-2 mt-0.5">
                                    <span className="text-white text-xs">!</span>
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    Become a leader in your community
                                  </span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Recommended Resources</h5>
                          <ul className="space-y-2">
                            {result?.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2 mt-0.5">
                                  <span className="text-white text-xs">{index + 1}</span>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Next Steps</h5>
                          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                              {score < 14
                                ? "Begin your journey by exploring our Digital Library and connecting with our community."
                                : score < 21
                                  ? "Deepen your knowledge and start implementing digital sovereignty practices in your daily life."
                                  : "Share your knowledge with others and consider becoming a leader in the movement."}
                            </p>
                            <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                              View personalized pathway →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full test call-to-action */}
                  <div className="bg-black dark:bg-white text-white dark:text-black rounded-xl p-8 mb-6 text-center">
                    <h4 className="font-bold text-xl mb-2">Want the Complete Assessment?</h4>
                    <p className="mb-4 text-gray-300 dark:text-gray-700">
                      This is just a preview. Take the full test to receive a comprehensive analysis of your Based
                      profile.
                    </p>
                    <a
                      href="https://HowBasedAreYou.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3 bg-white dark:bg-black text-black dark:text-white rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Take the Full Test at HowBasedAreYou.com
                    </a>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleRestartQuiz}
                      className="flex items-center justify-center px-6 py-2 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <RefreshCw size={18} className="mr-2" />
                      Take Quiz Again
                    </button>
                    <button
                      onClick={() => {
                        // Share functionality would go here
                        alert("Share functionality would be implemented here")
                      }}
                      className="flex items-center justify-center px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      <Share2 size={18} className="mr-2" />
                      Share Your Results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Quiz Powered by{" "}
          <a
            href="https://HowBasedAreYou.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            HowBasedAreYou.com
          </a>
          . Visit to take the full assessment.
        </p>
      </div>
    </section>
  )
}
