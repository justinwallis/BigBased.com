const SiteHeader = () => {
  return (
    <header className="bg-white border-b">
      <div className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Header content goes here */}
        <div className="flex items-center justify-between">
          <div>
            {/* Logo or site title */}
            <a href="/" className="text-2xl font-bold text-gray-800">
              My Website
            </a>
          </div>
          <nav>
            {/* Navigation links */}
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-800">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-800">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
