"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalPaymentProps {
  amount?: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  mode?: "payment" | "setup"
}

export function PayPalPayment({
  amount = 0,
  currency = "USD",
  onSuccess,
  onError,
  mode = "setup",
}: PayPalPaymentProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load PayPal SDK for payment mode only
    if (mode === "payment") {
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
    } else {
      // For setup mode, we don't need the SDK
      setIsLoading(false)
    }
  }, [currency, toast, mode])

  useEffect(() => {
    if (mode === "payment" && isScriptLoaded && window.paypal && paypalRef.current) {
      // Clear any existing PayPal buttons
      paypalRef.current.innerHTML = ""

      // For payment mode, show actual PayPal buttons
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
  }, [isScriptLoaded, amount, currency, onSuccess, onError, toast, mode])

  const handleConnectPayPal = async () => {
    try {
      setIsConnecting(true)

      // Call our API to start the OAuth flow
      const response = await fetch("/api/paypal/connect")
      const data = await response.json()

      if (!data.success || !data.authUrl) {
        throw new Error(data.error || "Failed to start PayPal connection")
      }

      // Open PayPal in a new popup window
      const popup = window.open(
        data.authUrl,
        "paypal-connect",
        "width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes",
      )

      if (!popup) {
        // Fallback to same tab if popup was blocked
        window.location.href = data.authUrl
        return
      }

      // Listen for the popup to close or for a message from the callback
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setIsConnecting(false)
          // Refresh the page to show updated payment methods
          window.location.reload()
        }
      }, 1000)

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === "PAYPAL_CONNECT_SUCCESS") {
          clearInterval(checkClosed)
          popup.close()
          setIsConnecting(false)
          onSuccess(event.data.details)
          window.removeEventListener("message", messageListener)
        } else if (event.data.type === "PAYPAL_CONNECT_ERROR") {
          clearInterval(checkClosed)
          popup.close()
          setIsConnecting(false)
          onError?.(event.data.error)
          window.removeEventListener("message", messageListener)
        }
      }

      window.addEventListener("message", messageListener)

      // Cleanup after 5 minutes
      setTimeout(
        () => {
          clearInterval(checkClosed)
          window.removeEventListener("message", messageListener)
          if (!popup.closed) {
            popup.close()
          }
          setIsConnecting(false)
        },
        5 * 60 * 1000,
      )
    } catch (error: any) {
      console.error("Error connecting PayPal:", error)
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect PayPal",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin dark:text-white" />
            <span className="ml-2 dark:text-white">Loading PayPal...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (mode === "setup") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
          <p className="mb-2">
            <strong className="dark:text-white">How PayPal works:</strong>
          </p>
          <ul className="space-y-1 text-xs">
            <li>• PayPal doesn't save payment methods like credit cards</li>
            <li>• You'll log into PayPal each time you make a payment</li>
            <li>• Your PayPal account, cards, and bank accounts will be available</li>
            <li>• Faster checkout once you're logged into PayPal</li>
          </ul>
        </div>

        <Button
          onClick={handleConnectPayPal}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 bg-[#0070f3] hover:bg-[#0051cc] text-white"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81.515.588.848 1.26 1.012 2.107z" />
              </svg>
              <ExternalLink className="h-4 w-4" />
            </>
          )}
          {isConnecting ? "Connecting..." : "Connect PayPal Account"}
        </Button>

        <p className="text-xs text-muted-foreground dark:text-gray-400 text-center">
          Opens in a new window for secure authentication
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={paypalRef} className="min-h-[50px] dark:bg-gray-800 dark:border-gray-600 rounded-lg p-2" />

      {!isScriptLoaded && (
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          PayPal is not available at the moment. Please try again later.
        </p>
      )}
    </div>
  )
}
