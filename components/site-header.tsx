const SiteHeader = () => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Website</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/about" className="text-gray-500 hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="/features" className="text-gray-500 hover:text-gray-900">
                Features
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
