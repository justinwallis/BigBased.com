import type { ReactNode } from "react"
import Link from "next/link"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "28rem", marginTop: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Link href="/" style={{ marginBottom: "1rem" }}>
            <div
              style={{
                position: "relative",
                width: "4rem",
                height: "4rem",
                backgroundColor: "#3B82F6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>BB</span>
            </div>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", color: "#111827" }}>BIG BASED</h1>
        </div>

        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
            padding: "2rem",
            border: "1px solid #E5E7EB",
            marginTop: "1.5rem",
          }}
        >
          {children}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
          <Link href="/" style={{ fontSize: "0.875rem", color: "#6B7280", textDecoration: "underline" }}>
            Return to Home
          </Link>
          <Link href="/admin" style={{ fontSize: "0.875rem", color: "#3B82F6", textDecoration: "underline" }}>
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
