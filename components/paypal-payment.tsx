"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalPaymentProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
}

export function PayPalPayment({ amount, currency = "USD", onSuccess, onError }: PayPalPaymentProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsScriptLoaded(true)
        setIsLoading(false)
        return
      }

      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture`
      script.async = true
      script.onload = () => {
        setIsScriptLoaded(true)
        setIsLoading(false)
      }
      script.onerror = () => {
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load PayPal SDK",
          variant: "destructive",
        })
      }
      document.body.appendChild(script)
    }

    loadPayPalScript()
  }, [currency, toast])

  useEffect(() => {
    if (isScriptLoaded && window.paypal && paypalRef.current) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = ""

      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                    currency_code: currency,
                  },
                  description: "Big Based - Payment",
                },
              ],
              application_context: {
                brand_name: "Big Based",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
              },
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture()
              onSuccess(details)
              toast({
                title: "Payment Successful",
                description: "Your PayPal payment has been processed successfully",
              })
            } catch (error) {
              console.error("PayPal payment capture error:", error)
              onError?.(error)
              toast({
                title: "Payment Error",
                description: "Failed to process PayPal payment",
                variant: "destructive",
              })
            }
          },
          onError: (error: any) => {
            console.error("PayPal payment error:", error)
            onError?.(error)
            toast({
              title: "Payment Error",
              description: "PayPal payment failed",
              variant: "destructive",
            })
          },
          onCancel: () => {
            toast({
              title: "Payment Cancelled",
              description: "PayPal payment was cancelled",
            })
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 40,
          },
        })
        .render(paypalRef.current)
    }
  }, [isScriptLoaded, amount, currency, onSuccess, onError, toast])

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-700 dark:border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 dark:text-white">Loading PayPal...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dark:bg-gray-700 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="dark:text-white">PayPal Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            Amount: {currency} ${amount.toFixed(2)}
          </p>
          <div ref={paypalRef} className="min-h-[50px]" />
          {!isScriptLoaded && (
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              PayPal is not available at the moment. Please try again later.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
