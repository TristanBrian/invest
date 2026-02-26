/**
 * Professional Invoice HTML Template Generator
 * Generates styled invoice emails and PDF-ready HTML
 */

import { Invoice, InvoiceLineItem } from "./invoice-types"

/**
 * Format currency values
 */
function formatCurrency(amount: number, currency: string = "KES"): string {
  const currencySymbols: Record<string, string> = {
    KES: "KSh",
    USD: "$",
    EUR: "€",
  }
  const symbol = currencySymbols[currency] || currency
  return `${symbol} ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Generate professional invoice HTML for client
 */
export function generateInvoiceHTML(invoice: Invoice): string {
  const lineItemsHTML = invoice.lineItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px; text-align: right;">${formatCurrency(item.unitPrice, invoice.details.currency)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; color: #1e3a5f; font-size: 14px; font-weight: 600; text-align: right;">${formatCurrency(item.total, invoice.details.currency)}</td>
    </tr>
  `
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="100%" max-width="800px" cellpadding="0" cellspacing="0" style="max-width: 800px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header with Company Info -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">OXIC INTERNATIONAL GROUP</h1>
                    <p style="margin: 5px 0 0 0; color: #b8d4e8; font-size: 13px;">Investment Advisory Services</p>
                  </td>
                  <td align="right">
                    <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">INVOICE</p>
                    <p style="margin: 8px 0 0 0; color: #b8d4e8; font-size: 14px; font-weight: 600;">${invoice.invoiceNumber}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Invoice Details Section -->
          <tr>
            <td style="padding: 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                <tr>
                  <!-- Bill To -->
                  <td style="width: 50%; vertical-align: top; padding-right: 30px;">
                    <h3 style="margin: 0 0 12px 0; color: #1e3a5f; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bill To</h3>
                    <p style="margin: 0 0 6px 0; color: #333; font-size: 15px; font-weight: 600;">${invoice.client.name}</p>
                    ${invoice.client.organization ? `<p style="margin: 0 0 6px 0; color: #666; font-size: 14px;">${invoice.client.organization}</p>` : ""}
                    ${invoice.client.address ? `<p style="margin: 0 0 6px 0; color: #666; font-size: 14px;">${invoice.client.address}</p>` : ""}
                    ${invoice.client.city ? `<p style="margin: 0 0 6px 0; color: #666; font-size: 14px;">${invoice.client.city}</p>` : ""}
                    ${invoice.client.country ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${invoice.client.country}</p>` : ""}
                    <p style="margin: 0 0 4px 0; color: #666; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${invoice.client.email}" style="color: #1e3a5f; text-decoration: none;">${invoice.client.email}</a></p>
                    ${invoice.client.phone ? `<p style="margin: 0; color: #666; font-size: 13px;"><strong>Phone:</strong> ${invoice.client.phone}</p>` : ""}
                  </td>

                  <!-- Invoice Info -->
                  <td style="width: 50%; vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; border: 1px solid #e5e5e5;">
                      <tr>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">
                          <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; font-weight: 600;">Invoice Number</p>
                          <p style="margin: 4px 0 0 0; color: #1e3a5f; font-size: 16px; font-weight: 700;">${invoice.invoiceNumber}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">
                          <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; font-weight: 600;">Invoice Date</p>
                          <p style="margin: 4px 0 0 0; color: #333; font-size: 14px;">${formatDate(invoice.details.invoiceDate)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">
                          <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; font-weight: 600;">Due Date</p>
                          <p style="margin: 4px 0 0 0; color: #333; font-size: 14px;">${formatDate(invoice.details.dueDate)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px;">
                          <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; font-weight: 600;">Status</p>
                          <p style="margin: 4px 0 0 0;">
                            <span style="background-color: ${invoice.status === "sent" ? "#e3f2fd" : "#fff3e0"}; color: ${invoice.status === "sent" ? "#1565c0" : "#e65100"}; padding: 4px 10px; border-radius: 3px; font-size: 12px; font-weight: 600; text-transform: capitalize;">${invoice.status}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Line Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #1e3a5f;">
                    <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: none;">Description</th>
                    <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: none;">Quantity</th>
                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: none;">Unit Price</th>
                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border: none;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHTML}
                </tbody>
              </table>

              <!-- Totals Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                <tr>
                  <td style="width: 60%;"></td>
                  <td style="width: 40%;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 15px; background-color: #f9f9f9; border: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600;">Subtotal:</td>
                        <td style="padding: 12px 15px; background-color: #f9f9f9; border: 1px solid #e5e5e5; text-align: right; color: #333; font-size: 14px; font-weight: 500;">${formatCurrency(invoice.subtotal, invoice.details.currency)}</td>
                      </tr>
                      ${
                        invoice.tax > 0
                          ? `
                      <tr>
                        <td style="padding: 12px 15px; background-color: #f9f9f9; border: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600;">Tax (${(invoice.details.taxRate || 0).toFixed(0)}%):</td>
                        <td style="padding: 12px 15px; background-color: #f9f9f9; border: 1px solid #e5e5e5; text-align: right; color: #333; font-size: 14px; font-weight: 500;">${formatCurrency(invoice.tax, invoice.details.currency)}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 15px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); border: none; color: #ffffff; font-size: 14px; font-weight: 700;">Total Due:</td>
                        <td style="padding: 15px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); border: none; text-align: right; color: #ffffff; font-size: 18px; font-weight: 700;">${formatCurrency(invoice.total, invoice.details.currency)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Terms & Notes -->
              ${
                invoice.details.paymentTerms
                  ? `
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #1e3a5f;">
                <h4 style="margin: 0 0 8px 0; color: #1e3a5f; font-size: 13px; font-weight: 600; text-transform: uppercase;">Payment Terms</h4>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${invoice.details.paymentTerms}</p>
              </div>
              `
                  : ""
              }

              ${
                invoice.details.notes
                  ? `
              <div style="background-color: #fef9e7; padding: 20px; border-radius: 6px; border-left: 4px solid #f9a825;">
                <h4 style="margin: 0 0 8px 0; color: #f9a825; font-size: 13px; font-weight: 600; text-transform: uppercase;">Additional Notes</h4>
                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">${invoice.details.notes}</p>
              </div>
              `
                  : ""
              }

            </td>
          </tr>

          <!-- Company Contact Footer -->
          <tr>
            <td style="background-color: #f9f9f9; border-top: 1px solid #e5e5e5; padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #1e3a5f; font-size: 13px; font-weight: 600; text-transform: uppercase;">Company Information</h4>
                    <p style="margin: 0 0 6px 0; color: #333; font-size: 13px; font-weight: 600;">OXIC INTERNATIONAL GROUP</p>
                    <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">Investment Advisory Services</p>
                    <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">
                      <strong>Email:</strong> <a href="mailto:Info@oxicinternational.co.ke" style="color: #1e3a5f; text-decoration: none;">Info@oxicinternational.co.ke</a>
                    </p>
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      <strong>Phone:</strong> +254 748 992 777
                    </p>
                  </td>
                  <td style="width: 50%; vertical-align: top; text-align: right;">
                    <p style="margin: 0 0 8px 0; color: #999; font-size: 12px;">
                      <strong>Website:</strong> <a href="https://www.oxicinternational.co.ke" style="color: #1e3a5f; text-decoration: none;">www.oxicinternational.co.ke</a>
                    </p>
                    <p style="margin: 0; color: #999; font-size: 11px;">© 2026 OXIC International Group. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #b8d4e8; font-size: 12px;">
                Thank you for your business. This is a computer-generated invoice.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Generate invoice summary for internal team email
 */
export function generateTeamNotificationHTML(invoice: Invoice): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Sent - ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Invoice Sent</h1>
              <p style="margin: 8px 0 0 0; color: #b8d4e8; font-size: 14px;">Client Notification</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">

              <h2 style="margin: 0 0 20px 0; color: #1e3a5f; font-size: 16px; font-weight: 600;">Invoice Summary</h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Invoice #</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; color: #1e3a5f; font-size: 14px; font-weight: 700;">${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Client</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; color: #333; font-size: 14px;">${invoice.client.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right;"><a href="mailto:${invoice.client.email}" style="color: #1e3a5f; text-decoration: none; font-size: 14px;">${invoice.client.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Invoice Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; color: #333; font-size: 14px;">${formatDate(invoice.details.invoiceDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Due Date</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; text-align: right; color: #333; font-size: 14px;">${formatDate(invoice.details.dueDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase;">Total Amount</td>
                  <td style="padding: 10px 0; text-align: right; color: #1e3a5f; font-size: 16px; font-weight: 700;">${formatCurrency(invoice.total, invoice.details.currency)}</td>
                </tr>
              </table>

              <!-- Line Items Summary -->
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 12px 0; color: #1e3a5f; font-size: 12px; font-weight: 600; text-transform: uppercase;">Items</h4>
                ${invoice.lineItems
                  .map(
                    (item) => `
                  <p style="margin: 0 0 6px 0; color: #333; font-size: 13px;">
                    <strong>${item.description}</strong> - ${item.quantity} x ${formatCurrency(item.unitPrice, invoice.details.currency)} = ${formatCurrency(item.total, invoice.details.currency)}
                  </p>
                `
                  )
                  .join("")}
              </div>

              <!-- Status -->
              <div style="background-color: #e3f2fd; border-left: 4px solid #1e3a5f; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #1565c0; font-size: 13px; font-weight: 600;">
                  ✓ Invoice has been successfully sent to the client
                </p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #fff3e0; border-left: 4px solid #f9a825; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #e65100; font-size: 13px; font-weight: 600;">
                  Monitor this invoice for payment status and follow up by due date if needed.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; border-top: 1px solid #e5e5e5; padding: 15px 30px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 11px;">
                OXIC International Group - Invoice Management System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
