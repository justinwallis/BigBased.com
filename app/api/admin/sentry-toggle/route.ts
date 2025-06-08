import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { enabled } = await request.json()

    // Here you could store the setting in your database
    // For now, we'll just return the current state

    return NextResponse.json({
      success: true,
      sentryEnabled: enabled,
      message: `Sentry ${enabled ? "enabled" : "disabled"}. Restart required for full effect.`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle Sentry" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const isEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true"
    const hasDsn = !!process.env.NEXT_PUBLIC_SENTRY_DSN

    return NextResponse.json({
      sentryEnabled: isEnabled,
      sentryConfigured: hasDsn,
      dsn: hasDsn ? "Configured" : "Not configured",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get Sentry status" }, { status: 500 })
  }
}
