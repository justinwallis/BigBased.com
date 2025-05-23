"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import ReactDOM from "react-dom/client"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Dynamically import the Payload admin UI
    import("@payloadcms/ui").then(({ PayloadUICoreProvider, PayloadAdminBar }) => {
      // Initialize the Payload admin UI
      const AdminUI = () => {
        return (
          <PayloadUICoreProvider>
            <PayloadAdminBar />
          </PayloadUICoreProvider>
        )
      }

      // Render the admin UI
      const adminRoot = document.getElementById("payload-admin")
      if (adminRoot) {
        const root = document.createElement("div")
        adminRoot.appendChild(root)
        // @ts-ignore
        ReactDOM.createRoot(root).render(<AdminUI />)
      }
    })

    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <div id="payload-admin" className="h-screen w-full" />
}
