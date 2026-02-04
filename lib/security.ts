import { NextRequest, NextResponse } from "next/server"

/**
 * Security Utilities for M-Pesa Payment System
 * Implements rate limiting, request validation, and security headers
 */

interface RateLimitEntry {
  count: number
  timestamp: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly windowMs = 60000 // 1 minute
  private readonly maxRequests = 5 // 5 requests per minute per IP

  /**
   * Check if request should be rate limited
   */
  isLimited(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry) {
      this.limits.set(identifier, { count: 1, timestamp: now })
      return false
    }

    // Reset window if expired
    if (now - entry.timestamp > this.windowMs) {
      this.limits.set(identifier, { count: 1, timestamp: now })
      return false
    }

    // Increment count
    entry.count++

    if (entry.count > this.maxRequests) {
      console.warn("[v0] Rate limit exceeded for:", identifier)
      return true
    }

    return false
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry) return this.maxRequests

    const now = Date.now()
    if (now - entry.timestamp > this.windowMs) return this.maxRequests

    return Math.max(0, this.maxRequests - entry.count)
  }

  /**
   * Reset limit for identifier (admin only)
   */
  reset(identifier: string): void {
    this.limits.delete(identifier)
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return "unknown"
}

/**
 * Validate request origin/domain
 */
export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  const allowedDomains = [
    "oxicinternational.co.ke",
    "www.oxicinternational.co.ke",
    "localhost",
    "127.0.0.1",
    "theoxic.netlify.app", // Netlify preview
  ]

  const domain = origin || referer || ""
  const isDomainAllowed = allowedDomains.some((allowed) => domain.includes(allowed))

  if (!isDomainAllowed) {
    console.warn("[v0] Invalid origin attempt:", domain)
  }

  return isDomainAllowed
}

/**
 * Validate payment request parameters
 */
export function validatePaymentRequest(body: unknown): {
  isValid: boolean
  error?: string
  phoneNumber?: string
  amount?: number
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, error: "Invalid request body" }
  }

  const data = body as Record<string, unknown>
  const { phoneNumber, amount } = data

  // Validate phone number
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return { isValid: false, error: "Phone number is required" }
  }

  if (!/^(\+254|0|254)\d{9}$/.test(phoneNumber.replace(/\s/g, ""))) {
    return { isValid: false, error: "Invalid phone number format" }
  }

  // Validate amount
  if (!amount || typeof amount !== "number") {
    return { isValid: false, error: "Amount is required" }
  }

  const numAmount = parseFloat(String(amount))

  if (isNaN(numAmount) || numAmount < 1 || numAmount > 150000) {
    return {
      isValid: false,
      error: "Amount must be between KES 1 and 150,000",
    }
  }

  return {
    isValid: true,
    phoneNumber,
    amount: numAmount,
  }
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:"
  )

  return response
}

/**
 * Add CORS headers
 */
export function addCorsHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get("origin")

  // Only allow from trusted domains
  const trustedDomains = [
    "https://oxicinternational.co.ke",
    "https://www.oxicinternational.co.ke",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]

  if (origin && trustedDomains.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set(
      "Access-Control-Allow-Methods",
      "POST, OPTIONS, GET"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )
    response.headers.set("Access-Control-Max-Age", "86400")
  }

  return response
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString()
  console.log("[v0] SECURITY:", timestamp, event, JSON.stringify(details))
}

/**
 * Detect suspicious patterns
 */
export function detectSuspiciousActivity(
  phoneNumber: string,
  amount: number,
  clientIp: string
): {
  isSuspicious: boolean
  reason?: string
} {
  // Check for extremely high amounts
  if (amount > 100000) {
    return {
      isSuspicious: true,
      reason: "Amount exceeds typical transaction size",
    }
  }

  // Check for rapid repeated requests (tracked separately)
  // This would be done through rate limiter

  // Check for unusual phone patterns
  if (phoneNumber.length < 10 || phoneNumber.length > 13) {
    return {
      isSuspicious: true,
      reason: "Phone number length suspicious",
    }
  }

  return { isSuspicious: false }
}

// Singleton instances
const rateLimiter = new RateLimiter()

export { rateLimiter }
