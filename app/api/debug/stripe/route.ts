import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

export async function POST() {
  try {
    const stripe = getStripe()

    // Test basic Stripe connection
    const account = await stripe.accounts.retrieve()

    // Test creating a test customer
    const testCustomer = await stripe.customers.create({
      email: "test@example.com",
      name: "Test Customer",
      metadata: {
        source: "debug_test",
      },
    })

    // Clean up test customer
    await stripe.customers.del(testCustomer.id)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stripe: {
        connected: true,
        accountId: account.id,
        testCustomerCreated: testCustomer.id,
        testCustomerDeleted: true,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      stripeError: {
        type: error.type,
        code: error.code,
        decline_code: error.decline_code,
      },
    })
  }
}
