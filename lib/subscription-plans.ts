export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    stripePriceId: "",
    features: ["Access to basic content", "Limited downloads (5/month)", "Community access", "Basic support"],
    limits: {
      downloads: 5,
      bookmarks: 10,
    },
  },
  based_supporter: {
    id: "based_supporter",
    name: "Based Supporter",
    price: 9.99,
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASED_SUPPORTER_PRICE_ID || "",
    features: [
      "All Free features",
      "Unlimited downloads",
      "Priority support",
      "Exclusive content access",
      "Ad-free experience",
      "Early access to new features",
    ],
    limits: {
      downloads: -1,
      bookmarks: 100,
    },
  },
  based_patriot: {
    id: "based_patriot",
    name: "Based Patriot",
    price: 19.99,
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASED_PATRIOT_PRICE_ID || "",
    features: [
      "All Based Supporter features",
      "Premium exclusive content",
      "Direct access to leadership",
      "Monthly video calls",
      "Custom profile badges",
      "Advanced analytics",
      "API access",
      "White-label options",
    ],
    limits: {
      downloads: -1,
      bookmarks: -1,
    },
  },
}
