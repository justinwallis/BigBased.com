"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement, LinkAuthenticationElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Smartphone, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { checkForDuplicateLink } from "@/app/actions/stripe-actions"

interface AddPaymentMethodProps {
  clientSecret: string
  customerId: string
  onSuccess: () => void
}

export function AddPaymentMethod({ clientSecret, customerId, onSuccess }: AddPaymentMethodProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [paymentType, setPaymentType] = useState<string | null>(null)
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

  // Check for duplicate Link when email changes
  useEffect(() => {
    const checkDuplicate = async () => {
      if (paymentType === "link" && email && customerId) {
        const result = await checkForDuplicateLink(customerId, email)
        if (result.success && result.isDuplicate) {
          setDuplicateWarning("You already have a Link payment method with this email.")
        } else {
          setDuplicateWarning(null)
        }
      } else {
        setDuplicateWarning(null)
      }
    }

    checkDuplicate()
  }, [email, paymentType, customerId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // If there's a duplicate Link warning and the payment type is Link, prevent submission
    if (duplicateWarning && paymentType === "link") {
      toast({
        title: "Duplicate Payment Method",
        description: "You already have a Link payment method with this email.",
        variant: "destructive",
      })
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

  // Track payment method type changes
  const handlePaymentElementChange = (event: any) => {
    setPaymentType(event.value.type)
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

            {duplicateWarning && (
              <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {duplicateWarning}
              </div>
            )}
          </div>

          {/* Payment Element - supports cards, Apple Pay, Google Pay, Link */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Payment Method</label>
            <PaymentElement
              onChange={handlePaymentElementChange}
              options={{
                layout: "tabs",
                paymentMethodOrder: ["card", "apple_pay", "google_pay", "link", "us_bank_account"],
                fields: {
                  billingDetails: {
                    name: "auto",
                    email: "auto",
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-400">
            <Smartphone className="h-4 w-4" />
            <span>Supports Apple Pay, Google Pay, and Link</span>
          </div>

          <Button
            type="submit"
            disabled={!stripe || isLoading || (!!duplicateWarning && paymentType === "link")}
            className="w-full"
          >
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
