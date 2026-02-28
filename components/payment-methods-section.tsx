"use client"

import React from "react"
import { Building2, Smartphone, CreditCard, FileText, Zap } from "lucide-react"

const paymentMethods = [
  { icon: Zap, title: "Cryptocurrency", description: "Binance Pay, Bitcoin & others", type: "crypto" },
  { icon: Building2, title: "Bank Transfer", description: "International & local banking", type: "bank" },
  { icon: Smartphone, title: "Mobile Money", description: "M-Pesa & regional services", type: "mpesa" },
  { icon: CreditCard, title: "Card Payments", description: "Visa, Mastercard accepted", type: "stripe" },
  { icon: FileText, title: "Institutional Invoicing", description: "DFI & corporate billing", type: "invoice" },
]

export function PaymentMethodsSection() {
  return (
    <section id="payments" className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-full">
            Flexible Payment Options
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl text-slate-900">
            Multiple Payment Methods
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 text-pretty">
            Choose the payment method that works best for your organization. All transactions are secure and processed quickly.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div
                key={index}
                className="p-6 border border-slate-200 rounded-lg bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{method.title}</h3>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Fast Processing</h3>
            <p className="text-sm text-slate-700">
              Transactions are processed instantly with real-time confirmation and notification.
            </p>
          </div>
          
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Secure & Encrypted</h3>
            <p className="text-sm text-slate-700">
              All payments are secured with enterprise-grade encryption and compliance standards.
            </p>
          </div>
          
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Expert Support</h3>
            <p className="text-sm text-slate-700">
              Our team is available to assist with any payment inquiries or questions you may have.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Get Started With Payment
          </a>
        </div>
      </div>
    </section>
  )
}
