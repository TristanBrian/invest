import { NextRequest, NextResponse } from "next/server"
import { getStripeClient, validateStripeConfig } from "@/lib/stripe-config"

/**
 * Manage Stripe Products (platform level)
 *
 * POST /api/stripe/products - Create a new product
 * Body: {
 *   "name": "Product Name",
 *   "description": "Product description",
 *   "priceInCents": 9999,
 *   "currency": "usd",
 *   "accountId": "acct_1234567890"  // Store mapping for seller
 * }
 *
 * GET /api/stripe/products - List all products
 * Response: {
 *   "success": true,
 *   "products": [...]
 * }
 */

export async function POST(request: NextRequest) {
  try {
    validateStripeConfig()
    const stripe = getStripeClient()

    const { name, description, priceInCents, currency = "usd", accountId } = await request.json()

    // Validate required fields
    if (!name || !priceInCents || !accountId) {
      return NextResponse.json(
        { success: false, error: "name, priceInCents, and accountId are required" },
        { status: 400 }
      )
    }

    // Validate price
    if (priceInCents < 50) {
      return NextResponse.json(
        { success: false, error: "Minimum price is 0.50" },
        { status: 400 }
      )
    }

    console.log("[v0] Creating product:", name, "for account:", accountId)

    // Create product at platform level
    // Store accountId in metadata to track which seller owns this product
    const product = await stripe.products.create({
      name,
      description: description || "",
      default_price_data: {
        unit_amount: Math.round(priceInCents),
        currency: currency.toLowerCase(),
      },
      metadata: {
        accountId,
        createdAt: new Date().toISOString(),
      },
    })

    console.log("[v0] Product created:", product.id)

    return NextResponse.json({
      success: true,
      productId: product.id,
      name: product.name,
      description: product.description,
      price: priceInCents,
      currency,
      accountId,
    })
  } catch (error) {
    console.error("[v0] Product creation error:", error)

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { success: false, error: "Payment system not configured" },
          { status: 503 }
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET() {
  try {
    validateStripeConfig()
    const stripe = getStripeClient()

    console.log("[v0] Fetching all products")

    // Get all products with their pricing
    const products = await stripe.products.list({
      limit: 100,
      expand: ["data.default_price"],
    })

    // Format products for display
    const formattedProducts = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      metadata: product.metadata,
      price: product.default_price
        ? {
            amount: (product.default_price as Record<string, unknown>).unit_amount,
            currency: (product.default_price as Record<string, unknown>).currency,
          }
        : null,
    }))

    console.log("[v0] Found", formattedProducts.length, "products")

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: products.data.length,
    })
  } catch (error) {
    console.error("[v0] Product fetch error:", error)

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { success: false, error: "Payment system not configured" },
          { status: 503 }
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
