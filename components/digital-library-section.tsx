const DigitalLibrarySection = () => {
  return (
    <section
      id="digital-library"
      className="py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/vintage-wooden-table.png)" }}
    >
      <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-[1px]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Explore Our Digital Library
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Discover a wealth of knowledge at your fingertips. Access a vast collection of digital resources, including
          books, articles, and multimedia content.
        </p>
        {/* Add more content here, such as search bar, featured items, etc. */}
      </div>
    </section>
  )
}

export default DigitalLibrarySection
