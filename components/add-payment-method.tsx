"use client"

import type React from "react"

import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddPaymentMethodProps {
  clientSecret: string
  onSuccess?: () => void
}

export function AddPaymentMethod({ clientSecret, onSuccess }: AddPaymentMethodProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/billing`,
        },
        redirect: "if_required",
      })

      if (result.error) {
        toast({
          title: "Payment method error",
          description: result.error.message || "Failed to add payment method",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Payment method added",
          description: "Your payment method has been added successfully",
        })
        setShowForm(false)
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <PaymentElement />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!stripe || isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Payment Method
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
