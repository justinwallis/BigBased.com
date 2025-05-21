import { notFound } from "next/navigation"

export default function FeatureSubpage({ params }: { params: { slug: string } }) {
  // This prevents 404 errors in the console by properly handling the route
  // In a real implementation, you would check if the slug exists and render content
  // For now, we'll just return a not found page
  notFound()

  // This code is unreachable but satisfies TypeScript
  return null
}
