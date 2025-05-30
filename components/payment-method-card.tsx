"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Trash2, Star } from "lucide-react"
import { deletePaymentMethod, setDefaultPaymentMethod } from "@/app/actions/stripe-actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface PaymentMethodCardProps {
  paymentMethod: any
  customerId: string
  isDefault?: boolean
  onUpdate: () => void
}

export function PaymentMethodCard({ paymentMethod, customerId, isDefault, onUpdate }: PaymentMethodCardProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePaymentMethod(paymentMethod.id)
      if (result.success) {
        toast({
          title: "Payment method removed",
          description: "Your payment method has been successfully removed.",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove payment method",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetDefault = async () => {
    setIsSettingDefault(true)
    try {
      const result = await setDefaultPaymentMethod(customerId, paymentMethod.id)
      if (result.success) {
        toast({
          title: "Default payment method updated",
          description: "This payment method is now your default.",
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to set default payment method",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSettingDefault(false)
    }
  }

  const card = paymentMethod.card

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">•••• •••• •••• {card.last4}</span>
                {isDefault && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Default</span>
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {card.brand.toUpperCase()} • Expires {card.exp_month}/{card.exp_year}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isDefault && (
              <Button variant="outline" size="sm" onClick={handleSetDefault} disabled={isSettingDefault}>
                {isSettingDefault ? "Setting..." : "Set Default"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? "Removing..." : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
