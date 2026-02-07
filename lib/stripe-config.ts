import Stripe from "stripe"

// Initialize Stripe client with proper versioning
const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  return new Stripe(apiKey, {
    apiVersion: "2026-01-28.clover",
  })
}

// Validate Stripe configuration
export const validateStripeConfig = () => {
  const requiredVars = ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "NEXT_PUBLIC_APP_URL"]

  const missing = requiredVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing Stripe configuration: ${missing.join(", ")}`)
  }

  return {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  }
}

// Export Stripe client factory
export { getStripeClient }
