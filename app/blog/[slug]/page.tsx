import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // For now, just show a placeholder since we can't fetch from CMS yet
  if (!params.slug) {
    notFound()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link
          href="/blog"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            marginBottom: "24px",
            display: "inline-block",
          }}
        >
          ← Back to all posts
        </Link>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          Blog Post: {params.slug}
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          This is a placeholder for the blog post "{params.slug}". Once the Payload CMS is set up, this page will
          display the actual content from the CMS.
        </p>

        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            borderRadius: "6px",
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: "0", color: "#374151" }}>
            <strong>Note:</strong> To create and manage blog posts, please use the admin panel.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/admin"
            style={{
              display: "inline-block",
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
