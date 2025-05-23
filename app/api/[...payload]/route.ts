import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API endpoint temporarily disabled" }, { status: 503 })
}

export async function POST() {
  return NextResponse.json({ message: "API endpoint temporarily disabled" }, { status: 503 })
}

export async function PUT() {
  return NextResponse.json({ message: "API endpoint temporarily disabled" }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ message: "API endpoint temporarily disabled" }, { status: 503 })
}
