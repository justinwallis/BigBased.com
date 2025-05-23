import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Big Based",
  description: "Find answers to common questions about Big Based, our mission, resources, and how to get involved.",
}

export default function FAQPage() {
  const faqItems = [
    {
      question: "What is Big Based?",
      answer:
        "Big Based is a platform dedicated to promoting conservative values, digital sovereignty, and building parallel economic systems.",
    },
    {
      question: "How can I get involved?",
      answer:
        "You can get involved by joining our community, participating in discussions, and supporting our mission through various initiatives.",
    },
    {
      question: "What resources do you offer?",
      answer:
        "We offer educational materials, digital tools, community forums, and resources for building alternative economic systems.",
    },
    {
      question: "Is Big Based free to use?",
      answer:
        "Many of our basic resources are free. Premium features and advanced tools may require a subscription or donation.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team through the contact page or by visiting our admin panel for technical assistance.",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", padding: "48px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "20px", color: "#6b7280" }}>
            Find answers to common questions about Big Based, our mission, and how to get involved.
          </p>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#374151", marginBottom: "16px" }}>
              FAQ content is managed through our CMS. Visit the admin panel to add, edit, or organize FAQ items.
            </p>
            <Link
              href="/admin"
              style={{
                color: "#2563eb",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Manage FAQ in Admin Panel →
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  {item.question}
                </h3>
                <p style={{ color: "#374151", lineHeight: "1.6" }}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
              Still have questions?
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Contact our team for additional support and information.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Contact Us
            </Link>
            <Link
              href="/admin"
              style={{
                border: "1px solid #2563eb",
                color: "#2563eb",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Admin Panel
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
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
