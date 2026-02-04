import crypto from "crypto"

/**
 * Transaction Manager for M-Pesa STK Push
 * Handles professional transaction ID generation, tracking, and logging
 */

export interface PaymentTransaction {
  transactionId: string
  merchantRequestId: string
  checkoutRequestId: string
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
  status: "INITIATED" | "WAITING" | "COMPLETED" | "FAILED" | "CANCELLED"
  responseCode?: string
  responseMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionLog {
  transactionId: string
  action: string
  details: Record<string, unknown>
  timestamp: Date
}

class TransactionManager {
  private transactions: Map<string, PaymentTransaction> = new Map()
  private logs: Map<string, TransactionLog[]> = new Map()

  /**
   * Generate professional transaction ID
   * Format: OXIC-YYYYMMDD-XXXXXXXX-XXXX
   * Example: OXIC-20260204-a7f2b3c1-5d8e
   */
  generateTransactionId(): string {
    const date = new Date()
    const dateStr = date
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")
    const randomBytes = crypto.randomBytes(6).toString("hex")
    const checksum = crypto
      .createHash("sha256")
      .update(randomBytes + dateStr)
      .digest("hex")
      .substring(0, 4)

    return `OXIC-${dateStr}-${randomBytes}-${checksum}`
  }

  /**
   * Create transaction record
   */
  createTransaction(
    merchantRequestId: string,
    checkoutRequestId: string,
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ): PaymentTransaction {
    const transaction: PaymentTransaction = {
      transactionId: this.generateTransactionId(),
      merchantRequestId,
      checkoutRequestId,
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      status: "INITIATED",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.transactions.set(transaction.transactionId, transaction)
    this.logs.set(transaction.transactionId, [])

    this.logAction(transaction.transactionId, "CREATED", {
      status: "INITIATED",
      amount,
      phoneNumber,
    })

    console.log("[v0] Transaction created:", transaction.transactionId)

    return transaction
  }

  /**
   * Update transaction status
   */
  updateTransactionStatus(
    transactionId: string,
    status: PaymentTransaction["status"],
    responseCode?: string,
    responseMessage?: string
  ): PaymentTransaction | null {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      console.error("[v0] Transaction not found:", transactionId)
      return null
    }

    transaction.status = status
    transaction.responseCode = responseCode
    transaction.responseMessage = responseMessage
    transaction.updatedAt = new Date()

    this.transactions.set(transactionId, transaction)

    this.logAction(transactionId, "STATUS_UPDATED", {
      status,
      responseCode,
      responseMessage,
    })

    console.log("[v0] Transaction updated:", transactionId, "->", status)

    return transaction
  }

  /**
   * Log action for transaction audit trail
   */
  logAction(
    transactionId: string,
    action: string,
    details: Record<string, unknown>
  ): void {
    if (!this.logs.has(transactionId)) {
      this.logs.set(transactionId, [])
    }

    const log: TransactionLog = {
      transactionId,
      action,
      details,
      timestamp: new Date(),
    }

    this.logs.get(transactionId)!.push(log)

    console.log(
      "[v0] Transaction log:",
      transactionId,
      action,
      JSON.stringify(details)
    )
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): PaymentTransaction | undefined {
    return this.transactions.get(transactionId)
  }

  /**
   * Get transaction by checkout request ID (from M-Pesa callback)
   */
  getTransactionByCheckoutId(
    checkoutRequestId: string
  ): PaymentTransaction | undefined {
    return Array.from(this.transactions.values()).find(
      (t) => t.checkoutRequestId === checkoutRequestId
    )
  }

  /**
   * Get all logs for transaction
   */
  getTransactionLogs(transactionId: string): TransactionLog[] {
    return this.logs.get(transactionId) || []
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): PaymentTransaction[] {
    return Array.from(this.transactions.values())
  }

  /**
   * Export transaction for invoice/receipt
   */
  exportTransactionForInvoice(
    transactionId: string
  ): Record<string, unknown> | null {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      return null
    }

    return {
      transactionId: transaction.transactionId,
      date: transaction.createdAt.toISOString(),
      amount: transaction.amount,
      phone: transaction.phoneNumber,
      reference: transaction.accountReference,
      status: transaction.status,
      description: transaction.transactionDesc,
    }
  }
}

// Singleton instance
const transactionManager = new TransactionManager()

export default transactionManager
