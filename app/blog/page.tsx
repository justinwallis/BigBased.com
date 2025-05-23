import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Big Based",
  description: "Read the latest articles and insights from Big Based",
}

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", padding: "48px 16px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>Blog</h1>
          <p style={{ fontSize: "20px", color: "#6b7280", marginBottom: "32px" }}>
            Read the latest articles and insights from Big Based
          </p>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ color: "#374151", marginBottom: "16px" }}>
              Blog content is managed through our CMS. Visit the admin panel to create and manage blog posts.
            </p>
            <Link
              href="/admin"
              style={{
                color: "#2563eb",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Go to Admin Panel →
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Sample blog post cards */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              Featured Image
            </div>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#1f2937" }}>
                Sample Blog Post
              </h2>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>January 15, 2024</p>
              <p style={{ color: "#374151", marginBottom: "16px" }}>
                This is a sample blog post. Create real content through the admin panel.
              </p>
              <Link href="/admin" style={{ color: "#2563eb", textDecoration: "underline" }}>
                Manage in Admin →
              </Link>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              Featured Image
            </div>
            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#1f2937" }}>
                Another Sample Post
              </h2>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>January 10, 2024</p>
              <p style={{ color: "#374151", marginBottom: "16px" }}>
                Another sample blog post. All content is managed through the CMS.
              </p>
              <Link href="/admin" style={{ color: "#2563eb", textDecoration: "underline" }}>
                Manage in Admin →
              </Link>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            href="/"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              fontSize: "16px",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
