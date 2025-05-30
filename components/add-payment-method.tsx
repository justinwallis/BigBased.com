"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement, LinkAuthenticationElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddPaymentMethodProps {
  clientSecret: string
  onSuccess: () => void
}

export function AddPaymentMethod({ clientSecret, onSuccess }: AddPaymentMethodProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/billing`,
        },
        redirect: "if_required",
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add payment method",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Payment method added successfully",
        })
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding payment method:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="dark:bg-gray-700 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <CreditCard className="h-5 w-5" />
          <span>Add Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Link Authentication Element for Link by Stripe */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Email for Link (optional)</label>
            <LinkAuthenticationElement
              onChange={(event) => {
                setEmail(event.value.email)
              }}
            />
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
              Save your payment info securely with Link for faster checkout
            </p>
          </div>

          {/* Payment Element - supports cards, Apple Pay, Google Pay, Link */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Payment Method</label>
            <PaymentElement
              options={{
                layout: "tabs",
                paymentMethodOrder: ["card", "apple_pay", "google_pay", "link"],
              }}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-400">
            <Smartphone className="h-4 w-4" />
            <span>Supports Apple Pay, Google Pay, and Link</span>
          </div>

          <Button type="submit" disabled={!stripe || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Payment Method...
              </>
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
