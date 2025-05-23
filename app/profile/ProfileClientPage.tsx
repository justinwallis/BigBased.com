"use client"

import Link from "next/link"

export default function ProfileClientPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#111827",
          }}
        >
          Profile Page
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          This is a placeholder profile page. Use the admin panel to manage content.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            Home
          </Link>
          <Link
            href="/admin"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#10b981",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
