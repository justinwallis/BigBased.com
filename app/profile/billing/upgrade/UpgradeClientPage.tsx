"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Info, Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/subscription-actions"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface UpgradeClientPageProps {
  currentPlanId: PlanId
  isActive: boolean
}

export default function UpgradeClientPage({ currentPlanId, isActive }: UpgradeClientPageProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<PlanId | null>(null)

  const handleUpgrade = async (planId: PlanId) => {
    if (planId === currentPlanId) return

    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan.stripePriceId) {
      toast({
        title: "Configuration Error",
        description: "This plan is not available for purchase at this time.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(planId)

    try {
      const result = await createCheckoutSession(plan.stripePriceId, planId)

      if (result.success && result.sessionUrl) {
        window.location.href = result.sessionUrl
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create checkout session",
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
      setIsLoading(null)
    }
  }

  const faqs = [
    {
      question: "How do subscriptions work?",
      answer:
        "Subscriptions are billed monthly or annually, depending on the plan you choose. You can cancel anytime, and your subscription will remain active until the end of the current billing period.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing period. When downgrading, your new plan will take effect at the end of your current billing period.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit cards, debit cards, and digital wallets including Apple Pay, Google Pay, and Link by Stripe. For US customers, we also accept bank transfers.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "We don't offer refunds for subscription payments, but you can cancel your subscription at any time to prevent future charges.",
    },
  ]

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your needs. All plans include access to our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Free Plan */}
        <Card className={`border ${currentPlanId === "free" ? "border-primary" : "border-border"}`}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Basic access to Big Based</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {SUBSCRIPTION_PLANS.free.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Downloads</span>
                <span>{SUBSCRIPTION_PLANS.free.limits.downloads} per month</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>Bookmarks</span>
                <span>Up to {SUBSCRIPTION_PLANS.free.limits.bookmarks}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={currentPlanId === "free" ? "outline" : "default"}
              disabled={currentPlanId === "free"}
            >
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Based Supporter */}
        <Card className={`border ${currentPlanId === "based_supporter" ? "border-primary" : "border-border"} relative`}>
          {currentPlanId !== "based_supporter" && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>Based Supporter</CardTitle>
            <CardDescription>Enhanced access and features</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {SUBSCRIPTION_PLANS.based_supporter.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Downloads</span>
                <span>Unlimited</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>Bookmarks</span>
                <span>Up to {SUBSCRIPTION_PLANS.based_supporter.limits.bookmarks}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {currentPlanId === "based_supporter" ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleUpgrade("based_supporter")} disabled={isLoading !== null}>
                {isLoading === "based_supporter" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentPlanId === "based_patriot" ? (
                  "Downgrade"
                ) : (
                  "Upgrade"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Based Patriot */}
        <Card className={`border ${currentPlanId === "based_patriot" ? "border-primary" : "border-border"}`}>
          <CardHeader>
            <CardTitle>Based Patriot</CardTitle>
            <CardDescription>Premium access and exclusive content</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {SUBSCRIPTION_PLANS.based_patriot.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Downloads</span>
                <span>Unlimited</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>Bookmarks</span>
                <span>Unlimited</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {currentPlanId === "based_patriot" ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleUpgrade("based_patriot")} disabled={isLoading !== null}>
                {isLoading === "based_patriot" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-muted/50 rounded-lg p-4 flex items-start mb-8">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium mb-1">About Subscriptions</h3>
            <p className="text-sm text-muted-foreground">
              Subscriptions are billed monthly and can be canceled at any time. When you upgrade, you'll be charged
              immediately for the new plan. When you downgrade, your new plan will take effect at the end of your
              current billing period.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
