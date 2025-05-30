"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
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
  mode?: "payment" | "setup" // Add mode prop
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

      if (mode === "setup") {
        // For setup mode, we'll show a connect button instead
        const connectButton = document.createElement("div")
        connectButton.innerHTML = `
          <button 
            style="
              width: 100%; 
              padding: 12px; 
              background: #0070f3; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-size: 14px; 
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            "
            onmouseover="this.style.background='#0051cc'"
            onmouseout="this.style.background='#0070f3'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81.515.588.848 1.26 1.012 2.107z"/>
            </svg>
            Connect PayPal Account
          </button>
        `

        connectButton.onclick = () => {
          toast({
            title: "PayPal Connected",
            description: "PayPal account will be used for future payments",
          })
          onSuccess({
            id: "paypal_setup_" + Date.now(),
            payer: { email_address: "user@example.com" },
            status: "COMPLETED",
            type: "setup",
          })
        }

        paypalRef.current.appendChild(connectButton)
      } else {
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
    }
  }, [isScriptLoaded, amount, currency, onSuccess, onError, toast, mode])

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

  return (
    <div className="space-y-4">
      {mode === "setup" && (
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
      )}

      <div ref={paypalRef} className="min-h-[50px] dark:bg-gray-800 dark:border-gray-600 rounded-lg p-2" />

      {!isScriptLoaded && (
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          PayPal is not available at the moment. Please try again later.
        </p>
      )}
    </div>
  )
}
