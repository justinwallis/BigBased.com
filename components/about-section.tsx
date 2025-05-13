import { AnimatedLogo } from "./animated-logo"
import { InteractiveLearningCenter } from "./interactive-learning-center"

export function AboutSection() {
  return (
    <section className="pt-6 pb-4 bg-gray-50 dark:bg-gray-900 about-section">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-1">
          <h2 className="text-2xl md:text-4xl font-bold mb-0 text-gray-900 dark:text-white">About Big Based</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm">
            Big Based represents the convergence of Political, Religious, and Technological transformation.
          </p>
        </div>

        {/* Eliminated margin-bottom (mb-0) and added negative margin to pull content up */}
        <div className="flex flex-col items-center -mb-2">
          <AnimatedLogo size="xxl" pulseEffect={true} />
        </div>

        {/* Removed top padding to eliminate whitespace */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow pt-0 pb-3 px-3 md:pb-4 md:px-4 border border-gray-100 dark:border-gray-700">
          <InteractiveLearningCenter />
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 italic text-sm">
            "The future belongs to those who prepare for it today." - Malcolm X
          </p>
        </div>
      </div>
    </section>
  )
}
