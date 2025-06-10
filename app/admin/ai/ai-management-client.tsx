"use client"

import { useState, useEffect } from "react"

interface AIModel {
  id: string
  name: string
  description: string
  endpoint: string
}

const AIManager = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/chat/models")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setModels(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  return (
    <div>
      <h1>AI Model Management</h1>
      {loading && <p>Loading models...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {models.map((model) => (
          <li key={model.id}>
            <h2>{model.name}</h2>
            <p>{model.description}</p>
            <p>Endpoint: {model.endpoint}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AIManager
