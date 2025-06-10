import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer).toString("utf-8")

    // For now, only process plain text files
    if (!file.type.startsWith("text/")) {
      return NextResponse.json({ error: "Only plain text files are supported in this environment." }, { status: 400 })
    }

    const documentName = file.name
    await ragSystem.indexDocument(documentName, fileContent)

    return NextResponse.json({ message: `Document "${documentName}" indexed successfully.` })
  } catch (error: any) {
    console.error("Document upload API error:", error)
    return NextResponse.json({ error: error.message || "Failed to upload and index document." }, { status: 500 })
  }
}
