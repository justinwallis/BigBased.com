// Define subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    interval: null,
    features: ["Access to basic content", "Community discussions", "Limited downloads", "Email support"],
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
    stripePriceId: process.env.STRIPE_BASED_SUPPORTER_PRICE_ID,
    features: [
      "All Free features",
      "Unlimited downloads",
      "Priority support",
      "Exclusive content access",
      "Ad-free experience",
      "Early access to new features",
    ],
    limits: {
      downloads: -1, // unlimited
      bookmarks: 100,
    },
  },
  based_patriot: {
    id: "based_patriot",
    name: "Based Patriot",
    price: 19.99,
    interval: "month",
    stripePriceId: process.env.STRIPE_BASED_PATRIOT_PRICE_ID,
    features: [
      "All Based Supporter features",
      "Premium content library",
      "Direct messaging with creators",
      "Monthly virtual events",
      "Custom profile badges",
      "API access",
    ],
    limits: {
      downloads: -1, // unlimited
      bookmarks: -1, // unlimited
    },
  },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS
