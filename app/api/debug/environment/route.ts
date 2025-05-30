import { NextResponse } from "next/server"

export async function POST() {
  try {
    const envVars = {
      // Supabase
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

      // Stripe
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

      // Other
      neonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
      databaseUrl: !!process.env.DATABASE_URL,
    }

    const urls = {
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 30) + "...",
      nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + "...",
      neonUrl: process.env.NEON_DATABASE_URL?.substring(0, 30) + "...",
      databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "...",
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      envVars,
      urls,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
