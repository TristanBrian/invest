"use client"

/**
 * React Hook for Invoice Management
 * Provides methods to generate and send invoices with full type safety
 */

import { useState, useCallback } from "react"
import { InvoiceSendRequest, InvoiceSendResponse } from "./invoice-types"

interface UseInvoiceState {
  loading: boolean
  error: string | null
  success: boolean
}

interface UseInvoiceReturn extends UseInvoiceState {
  sendInvoice: (request: InvoiceSendRequest) => Promise<InvoiceSendResponse | null>
  reset: () => void
}

export function useInvoice(): UseInvoiceReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const sendInvoice = useCallback(
    async (request: InvoiceSendRequest): Promise<InvoiceSendResponse | null> => {
      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        const response = await fetch("/api/invoices/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        })

        const data = await response.json()

        if (!response.ok) {
          const errorMessage = data.message || "Failed to send invoice"
          setError(errorMessage)
          setLoading(false)
          return null
        }

        setSuccess(data.success)
        setLoading(false)
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while sending the invoice"
        setError(errorMessage)
        setLoading(false)
        return null
      }
    },
    []
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  return {
    loading,
    error,
    success,
    sendInvoice,
    reset,
  }
}
