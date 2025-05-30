"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, CreditCard, Loader2 } from "lucide-react"
import { deletePaymentMethod, setDefaultPaymentMethod } from "@/app/actions/stripe-actions"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethodCardProps {
  paymentMethod: any
  customerId: string
  isDefault?: boolean
  onUpdate?: () => void
}

export function PaymentMethodCard({ paymentMethod, customerId, isDefault, onUpdate }: PaymentMethodCardProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      setIsDeleting(true)
      try {
        const result = await deletePaymentMethod(paymentMethod.id)
        if (result.success) {
          toast({
            title: "Payment method removed",
            description: "Your payment method has been removed successfully",
          })
          if (onUpdate) {
            onUpdate()
          }
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to remove payment method",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleSetDefault = async () => {
    setIsSettingDefault(true)
    try {
      const result = await setDefaultPaymentMethod(customerId, paymentMethod.id)
      if (result.success) {
        toast({
          title: "Default payment method updated",
          description: "Your default payment method has been updated",
        })
        if (onUpdate) {
          onUpdate()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update default payment method",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSettingDefault(false)
    }
  }

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  return (
    <Card className={`overflow-hidden ${isDefault ? "border-purple-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {formatCardBrand(paymentMethod.card.brand)} •••• {paymentMethod.card.last4}
              </p>
              <p className="text-xs text-muted-foreground">
                Expires {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isDefault ? (
              <div className="flex items-center text-xs text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Default
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleSetDefault} disabled={isSettingDefault || isDeleting}>
                {isSettingDefault ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="text-xs">Set Default</span>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || isSettingDefault}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
