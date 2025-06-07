"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Domain {
  id: string
  name: string
  is_verified: boolean
  created_at: string
}

const DomainAdminClient = () => {
  const [domains, setDomains] = useState<Domain[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDomains = async () => {
      const { data, error } = await supabase.from("domains").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching domains:", error)
      } else {
        setDomains(data || [])
      }
    }

    fetchDomains()
  }, [supabase])

  return (
    <div>
      <h2>Domains</h2>
      {domains.length > 0 ? (
        <ul>
          {domains.map((domain) => (
            <li key={domain.id}>
              {domain.name} - Verified: {domain.is_verified ? "Yes" : "No"} - Created At: {domain.created_at}
            </li>
          ))}
        </ul>
      ) : (
        <p>No domains found.</p>
      )}
    </div>
  )
}

export default DomainAdminClient
