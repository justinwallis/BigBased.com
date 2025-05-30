import { NextResponse } from "next/server"
import { getOrCreateStripeCustomer } from "@/app/actions/stripe-actions"

export async function POST() {
  try {
    const result = await getOrCreateStripeCustomer()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
