import { uploadDocument } from "@/lib/ai-rag-system"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { fileContent, metadata } = await req.json()
    await uploadDocument(fileContent, metadata)
    return NextResponse.json({ success: true, message: "Document uploaded and indexed." })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Failed to upload document." }, { status: 500 })
  }
}
