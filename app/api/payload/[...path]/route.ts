import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const payload = await getPayload()
    const res = await payload.request(req)
    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req)
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req)
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req)
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req)
}

async function handlePayloadRequest(req: NextRequest) {
  try {
    const payload = await getPayload()
    const res = await payload.request(req)
    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
