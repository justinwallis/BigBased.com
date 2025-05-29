import { type NextRequest, NextResponse } from "next/server"
import { sendNotificationToUsers } from "@/app/actions/notification-actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow authenticated admin users to send notifications
    // You might want to add additional role checking here
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationType, title, message, url, data } = body

    if (!notificationType || !title || !message) {
      return NextResponse.json({ error: "Missing required fields: notificationType, title, message" }, { status: 400 })
    }

    const result = await sendNotificationToUsers(notificationType, title, message, url, data)

    if (result.success) {
      return NextResponse.json({
        success: true,
        notificationId: result.notificationId,
        recipientCount: result.recipientCount,
        message: result.message,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in notification API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
