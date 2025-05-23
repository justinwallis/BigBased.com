"use client"

interface SideMenuProps {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  openWithSearch?: boolean
}

export default function SideMenu({ isOpen = false, setIsOpen = () => {}, openWithSearch = false }: SideMenuProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          Close
        </button>
        <div className="mt-8">
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="/" className="block p-2 hover:bg-gray-100 rounded">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="block p-2 hover:bg-gray-100 rounded">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="block p-2 hover:bg-gray-100 rounded">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="block p-2 hover:bg-gray-100 rounded">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
