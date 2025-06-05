import type React from "react"

interface SiteHeaderProps {
  title: string
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background">
      <div className="container flex h-14 items-center">
        <p className="mr-auto font-semibold">{title}</p>
        {/* Add navigation or other header elements here */}
      </div>
    </header>
  )
}

export default SiteHeader
