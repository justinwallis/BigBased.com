import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface DropdownItem {
  label: string
  href: string
}

interface DropdownMenuProps {
  label: string
  items: DropdownItem[]
}

export default function DropdownMenu({ label, items }: DropdownMenuProps) {
  return (
    <div className="relative group">
      <button className="font-medium flex items-center">
        {label}
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left">
        {items.map((item, index) => (
          <Link key={index} href={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
