import { type NextRequest, NextResponse } from "next/server"
import { ragSystem } from "@/lib/ai-rag-system"
import pdf from "pdf-parse"
import mammoth from "mammoth" // Import mammoth

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("document") as File | null

    if (!file) {
      return NextResponse.json({ error: "No document file provided" }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    let extractedText = ""
    let documentTitle = file.name.split(".").slice(0, -1).join(".") || file.name // Default title

    // Determine file type and extract content
    if (file.type === "application/pdf") {
      const data = await pdf(fileBuffer)
      extractedText = data.text
      if (data.info.Title) {
        documentTitle = data.info.Title
      }
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // DOCX file
      const result = await mammoth.extractRawText({ buffer: fileBuffer })
      extractedText = result.value
      // Mammoth doesn't easily give title, so use filename
    } else if (file.type.startsWith("text/")) {
      extractedText = fileBuffer.toString("utf-8")
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, DOCX, and plain text files are supported." },
        { status: 400 },
      )
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "Could not extract text from the document" }, { status: 400 })
    }

    // Generate a unique ID for the document
    const documentId = `${documentTitle.replace(/[^a-zA-Z0-9]/g, "_")}-${Date.now()}`

    await ragSystem.addDocument({
      id: documentId,
      content: extractedText,
      metadata: {
        type: "uploaded_document", // A new type for uploaded docs
        title: documentTitle,
        filename: file.name,
        file_type: file.type,
        size: file.size,
        url: `/uploaded-docs/${documentId}`, // A placeholder URL for retrieval
        created_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Document "${documentTitle}" indexed successfully!`,
      documentId,
    })
  } catch (error) {
    console.error("Document upload API error:", error)
    return NextResponse.json(
      { error: `Failed to upload and index document: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
