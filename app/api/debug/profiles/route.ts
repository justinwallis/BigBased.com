import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return NextResponse.json({
        success: false,
        error: "Not authenticated",
        userError,
      })
    }

    // Test profile access
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    // Test stripe_customer_id column specifically
    const { data: stripeTest, error: stripeError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", userData.user.id)
      .single()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      user: {
        id: userData.user.id,
        email: userData.user.email,
      },
      profile: {
        exists: !!profile,
        data: profile,
        error: profileError,
      },
      stripeColumn: {
        exists: !stripeError,
        hasStripeCustomerId: !!stripeTest?.stripe_customer_id,
        stripeCustomerId: stripeTest?.stripe_customer_id,
        error: stripeError,
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
