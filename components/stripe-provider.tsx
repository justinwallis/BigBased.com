"use client"

import type React from "react"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { getStripePublishableKey } from "@/lib/stripe"

let stripePromise: Promise<any> | null = null

const getStripePromise = () => {
  if (!stripePromise) {
    try {
      const publishableKey = getStripePublishableKey()
      stripePromise = loadStripe(publishableKey)
    } catch (error) {
      console.error("Failed to load Stripe:", error)
      return null
    }
  }
  return stripePromise
}

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const stripe = getStripePromise()

  if (!stripe) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Payment system is not configured</p>
      </div>
    )
  }

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
        },
      }
    : undefined

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  )
}
