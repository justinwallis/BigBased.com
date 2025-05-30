import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient(true) // Use service role to bypass RLS

    // Test 1: Try to select the stripe_customer_id column directly
    const { data: directTest, error: directError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", "db28e1b1-9b48-4028-a332-4764becea385")
      .single()

    // Test 2: Try to update the column directly
    const { data: updateTest, error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: "test_value_" + Date.now() })
      .eq("id", "db28e1b1-9b48-4028-a332-4764becea385")
      .select("id, stripe_customer_id")
      .single()

    // Test 3: Try to set it back to null
    const { data: nullTest, error: nullError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: null })
      .eq("id", "db28e1b1-9b48-4028-a332-4764becea385")
      .select("id, stripe_customer_id")
      .single()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        directSelect: {
          success: !directError,
          data: directTest,
          error: directError,
        },
        directUpdate: {
          success: !updateError,
          data: updateTest,
          error: updateError,
        },
        nullUpdate: {
          success: !nullError,
          data: nullTest,
          error: nullError,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }
}
