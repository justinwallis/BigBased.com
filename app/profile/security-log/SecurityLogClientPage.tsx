"use client"

import Link from "next/link"

export default function SecurityLogClientPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Security Log
          </h1>
          <p
            style={{
              color: "#6b7280",
              margin: "0",
            }}
          >
            View your account security activity and authentication history
          </p>
        </div>

        <div style={{ padding: "1.5rem" }}>
          <p style={{ textAlign: "center", margin: "2rem 0" }}>
            Security logs are temporarily unavailable while we set up the CMS.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <Link
              href="/admin"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "0.25rem",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Go to Admin Panel
            </Link>

            <Link
              href="/profile"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
