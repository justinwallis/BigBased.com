import { InteractiveLearningCenter } from "./interactive-learning-center"

export function AboutSection() {
  return (
    <section className="pt-3 pb-2 bg-gray-50 dark:bg-gray-900 about-section">
      <div className="container mx-auto px-3 md:px-4">
        {/* Added more padding to the title area */}
        <div className="text-center mb-3 py-3">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">About Big Based</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm">
            Big Based represents the convergence of Political, Religious, and Technological transformation.
          </p>
        </div>

        {/* Reduced padding and spacing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow pt-0 pb-2 px-2 md:pb-3 md:px-3 border border-gray-100 dark:border-gray-700 mt-2">
          <InteractiveLearningCenter />
        </div>

        <div className="mt-2 text-center">
          <p className="text-gray-600 dark:text-gray-400 italic text-sm">
            "The future belongs to those who prepare for it today." - Malcolm X
          </p>
        </div>
      </div>
    </section>
  )
}
