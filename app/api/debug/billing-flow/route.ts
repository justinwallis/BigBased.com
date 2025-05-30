import { NextResponse } from "next/server"
import { getOrCreateStripeCustomer, getCustomerPaymentMethods, createSetupIntent } from "@/app/actions/stripe-actions"

export async function POST() {
  try {
    const steps: any[] = []

    // Step 1: Get or create Stripe customer
    steps.push({ step: "getOrCreateCustomer", status: "running" })
    const customerResult = await getOrCreateStripeCustomer()
    steps[0].status = customerResult.success ? "success" : "failed"
    steps[0].result = customerResult

    if (!customerResult.success) {
      return NextResponse.json({
        success: false,
        error: "Failed to get/create customer",
        steps,
      })
    }

    // Step 2: Get payment methods
    steps.push({ step: "getPaymentMethods", status: "running" })
    const paymentMethodsResult = await getCustomerPaymentMethods(customerResult.customerId)
    steps[1].status = paymentMethodsResult.success ? "success" : "failed"
    steps[1].result = paymentMethodsResult

    // Step 3: Create setup intent
    steps.push({ step: "createSetupIntent", status: "running" })
    const setupIntentResult = await createSetupIntent(customerResult.customerId)
    steps[2].status = setupIntentResult.success ? "success" : "failed"
    steps[2].result = setupIntentResult

    const allSuccess = steps.every((step) => step.status === "success")

    return NextResponse.json({
      success: allSuccess,
      timestamp: new Date().toISOString(),
      steps,
      summary: {
        customerId: customerResult.customerId,
        paymentMethodCount: paymentMethodsResult.success ? paymentMethodsResult.paymentMethods?.length || 0 : 0,
        hasSetupIntent: setupIntentResult.success,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
