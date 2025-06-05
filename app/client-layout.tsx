import type React from "react"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-background">
      <main className="flex-grow">{children}</main>
    </div>
  )
}

export default ClientLayout
