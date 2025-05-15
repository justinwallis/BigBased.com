"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface StructuredDataProps {
  data: any
}

export default function StructuredData({ data }: StructuredDataProps) {
  const [jsonLd, setJsonLd] = useState<string>("")

  useEffect(() => {
    // Only stringify the data on the client side to avoid hydration issues
    setJsonLd(JSON.stringify(data))
  }, [data])

  if (!jsonLd) return null

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      strategy="afterInteractive"
    />
  )
}
