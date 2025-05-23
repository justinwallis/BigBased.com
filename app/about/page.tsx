import Link from "next/link"

export const metadata = {
  title: "About - Big Based",
  description:
    "Learn about Big Based, a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", padding: "2rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "black" }}>
          About Big Based
        </h1>

        <p style={{ marginBottom: "1rem", color: "#374151" }}>
          Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and
          building a parallel economy based on freedom and responsibility.
        </p>

        <p style={{ marginBottom: "1rem", color: "#374151" }}>
          Our mission is to provide tools, knowledge, and community for those seeking to break free from manipulation
          and censorship while fostering connections between freedom-minded individuals.
        </p>

        <p style={{ marginBottom: "2rem", color: "#374151" }}>
          Founded on principles of truth, faith, and freedom, Big Based offers a comprehensive library of 10,000+
          meticulously researched pages, community connections, and practical solutions for navigating the challenges of
          our time.
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: "500",
              textDecoration: "none",
              display: "inline-block",
              marginRight: "1rem",
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/admin"
            style={{
              backgroundColor: "#3B82F6",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: "500",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
