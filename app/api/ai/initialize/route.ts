import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"

export async function POST(request: NextRequest) {
  try {
    // Initialize Qdrant collections
    await ragSystem.initializeCollections()

    // Index existing CMS content
    await ragSystem.indexCMSContent()

    return NextResponse.json({
      success: true,
      message: "AI/RAG system initialized successfully",
    })
  } catch (error) {
    console.error("Initialize API error:", error)
    return NextResponse.json({ error: "Failed to initialize AI system" }, { status: 500 })
  }
}
