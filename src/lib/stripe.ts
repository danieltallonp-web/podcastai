import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
})

// Plan price IDs (configure in Stripe Dashboard)
export const PLAN_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID ?? "",
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_PRICE_ID ?? "",
} as const
