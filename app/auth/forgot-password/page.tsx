import Link from "next/link"

export const metadata = {
  title: "Forgot Password - Big Based",
  description: "Reset your Big Based account password",
}

export default function ForgotPasswordPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          maxWidth: "28rem",
          width: "100%",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem", textAlign: "center" }}>
          Reset your password
        </h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "1rem" }}>
            Password reset functionality is available in the admin panel.
          </p>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          <p style={{ color: "#6B7280" }}>
            Remember your password?{" "}
            <Link href="/auth/sign-in" style={{ color: "#3B82F6", textDecoration: "underline", fontWeight: "500" }}>
              Sign in
            </Link>
          </p>
          <p style={{ color: "#6B7280", marginTop: "0.5rem" }}>
            <Link href="/admin" style={{ color: "#3B82F6", textDecoration: "underline", fontWeight: "500" }}>
              Go to Admin Panel
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
