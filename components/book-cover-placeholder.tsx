interface BookCoverPlaceholderProps {
  title: string
  author: string
  width?: number
  height?: number
  className?: string
}

export default function BookCoverPlaceholder({
  title,
  author,
  width = 200,
  height = 300,
  className = "",
}: BookCoverPlaceholderProps) {
  // Generate a consistent color based on the title
  const getColorFromString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 35%)`
  }

  const bgColor = getColorFromString(title)

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-md overflow-hidden shadow-md ${className} dark:shadow-none dark:border dark:border-white/10`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
      }}
    >
      <div className="absolute inset-0 flex flex-col p-4">
        <div className="flex-grow flex items-center justify-center">
          <h3 className="text-white text-center font-bold text-lg leading-tight">{title}</h3>
        </div>
        <div className="text-white text-center text-sm opacity-80 mt-2">by {author}</div>
      </div>
    </div>
  )
}
