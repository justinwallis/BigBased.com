import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient(false)
    const serviceSupabase = createClient(true)

    // Test regular client
    const { data: userData, error: userError } = await supabase.auth.getUser()

    // Test service role client
    const { data: serviceTest, error: serviceError } = await serviceSupabase.from("profiles").select("count").limit(1)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      regularClient: {
        hasUser: !!userData?.user,
        userId: userData?.user?.id,
        userEmail: userData?.user?.email,
        error: userError,
      },
      serviceClient: {
        canQuery: !serviceError,
        error: serviceError,
        data: serviceTest,
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
