"use client"

import { logAuthEvent } from "@/app/actions/auth-log-actions"
import { AUTH_EVENTS, AUTH_STATUS } from "@/app/constants/auth-log-constants"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface TrustedDevice {
  id: string
  name: string
  lastUsed: string // Or Date, depending on your data
}

const TrustedDevicesClientPage = () => {
  const { data: session } = useSession()
  const [trustedDevices, setTrustedDevices] = useState<TrackedDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrustedDevices = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/trusted-devices")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTrustedDevices(data)
      } catch (error) {
        console.error("Failed to fetch trusted devices:", error)
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchTrustedDevices()
    }
  }, [session?.user?.email])

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      // Replace with your actual API endpoint for removing a device
      const response = await fetch(`/api/trusted-devices/${deviceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update the state to reflect the removal
      setTrustedDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId))

      logAuthEvent(AUTH_EVENTS.TRUSTED_DEVICE_REMOVED, {
        status: AUTH_STATUS.SUCCESS,
        userId: session?.user?.email,
        deviceId: deviceId,
      })
    } catch (error) {
      console.error("Failed to remove trusted device:", error)
      // Handle error appropriately (e.g., display an error message)
      logAuthEvent(AUTH_EVENTS.TRUSTED_DEVICE_REMOVED, {
        status: AUTH_STATUS.FAILURE,
        userId: session?.user?.email,
        deviceId: deviceId,
        error: String(error),
      })
    }
  }

  if (isLoading) {
    return <div>Loading trusted devices...</div>
  }

  return (
    <div>
      <h2>Trusted Devices</h2>
      {trustedDevices.length === 0 ? (
        <p>No trusted devices found.</p>
      ) : (
        <ul>
          {trustedDevices.map((device) => (
            <li key={device.id}>
              {device.name} - Last Used: {device.lastUsed}
              <button onClick={() => handleRemoveDevice(device.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { TrustedDevicesClientPage }
export default TrustedDevicesClientPage
