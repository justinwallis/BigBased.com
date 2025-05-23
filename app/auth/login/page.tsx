import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log In - Big Based",
  description: "Log in to your Big Based account",
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Log In to Big Based
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#6b7280",
          }}
        >
          Please use the admin panel to log in and manage content.
        </p>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
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

        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
