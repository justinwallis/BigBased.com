"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface AddPaymentMethodProps {
  clientSecret: string
  onSuccess: () => void
}

export function AddPaymentMethod({ clientSecret, onSuccess }: AddPaymentMethodProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsLoading(false)
      return
    }

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
        title: "Payment method added",
        description: "Your payment method has been successfully added.",
      })
      setShowForm(false)
      onSuccess()
    }

    setIsLoading(false)
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Payment Method
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={!stripe || isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Payment Method"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
