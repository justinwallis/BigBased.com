"use client"

import Link from "next/link"

export function SimpleRecoveryPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/profile"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#0070f3",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          ← Back to Profile
        </Link>
      </div>

      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Account Recovery Methods</h1>

      <div
        style={{
          padding: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Payload CMS Admin</h2>
        <p style={{ marginBottom: "16px", lineHeight: "1.5" }}>
          Account recovery features are currently managed through the Payload CMS admin panel. Please visit the admin
          panel to manage your account settings.
        </p>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            backgroundColor: "#0070f3",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Go to Admin Panel
        </Link>
      </div>

      <div
        style={{
          padding: "24px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Available Recovery Methods</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
          <li>Security questions</li>
          <li>Recovery email</li>
          <li>Recovery phone number</li>
        </ul>
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#6b7280" }}>
          These features will be available in the user interface after the CMS integration is complete.
        </p>
      </div>
    </div>
  )
}
