import { type NextRequest, NextResponse } from "next/server"
import { contentIndexer } from "@/lib/rag/indexer"

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json()

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 })
    }

    // Sync Google Drive content
    await contentIndexer.indexGoogleDrive(tenantId)

    return NextResponse.json({ success: true, message: "Google Drive content synced successfully" })
  } catch (error) {
    console.error("Error syncing Google Drive:", error)
    return NextResponse.json({ error: "Failed to sync Google Drive content" }, { status: 500 })
  }
}
