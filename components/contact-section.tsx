"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    interest: "",
    message: "",
    consent: false,
  })

  const [errors, setErrors] = useState<{
    email?: string
    phone?: string
    name?: string
    interest?: string
    message?: string
    consent?: string
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true // Phone is optional
    const phoneRegex = /^[+]?[\d\s-]{7,20}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, +, spaces, and dashes
    const sanitized = value.replace(/[^0-9+\s-]/g, "")
    setFormData({ ...formData, phone: sanitized })

    // Clear error when user starts typing correctly
    if (errors.phone && validatePhone(sanitized)) {
      setErrors({ ...errors, phone: undefined })
    }
  }

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value })

    // Clear error when user starts typing a valid email
    if (errors.email && validateEmail(value)) {
      setErrors({ ...errors, email: undefined })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., john@example.com)"
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (numbers only)"
    }

    if (!formData.interest) {
      newErrors.interest = "Please select an investment interest"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    if (!formData.consent) {
      newErrors.consent = "Please accept the consent checkbox to proceed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const whatsappMessage = `
*New Investment Enquiry*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Organization:* ${formData.organization || "N/A"}
*Phone:* ${formData.phone || "N/A"}
*Investment Interest:* ${formData.interest}

*Message:*
${formData.message}
    `.trim()

    const whatsappNumber = "254704527743"

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

    window.open(whatsappUrl, "_blank")

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        interest: "",
        message: "",
        consent: false,
      })
      setErrors({})
      setIsSubmitting(false)
    }, 1000)
  }

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null
    return (
      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        {message}
      </p>
    )
  }

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">{"Get In Touch"}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {"Ready to explore investment opportunities in East Africa? Contact us for a consultation"}
          </p>
        </div>

        <Card className="mx-auto max-w-2xl border-border">
          <CardHeader>
            <CardTitle>{"Investment Enquiry Form"}</CardTitle>
            <CardDescription>
              {"Fill out the form below and our team will get back to you within 24 hours"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {"Name"} <span className="text-destructive">{"*"}</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name && e.target.value.trim()) {
                        setErrors({ ...errors, name: undefined })
                      }
                    }}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  <ErrorMessage message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {"Email"} <span className="text-destructive">{"*"}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  <ErrorMessage message={errors.email} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organization">{"Organization"}</Label>
                  <Input
                    id="organization"
                    placeholder="Company Name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{"Phone"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  <ErrorMessage message={errors.phone} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">
                  {"Investment Interest"} <span className="text-destructive">{"*"}</span>
                </Label>
                <Select
                  value={formData.interest}
                  onValueChange={(value) => {
                    setFormData({ ...formData, interest: value })
                    if (errors.interest) {
                      setErrors({ ...errors, interest: undefined })
                    }
                  }}
                >
                  <SelectTrigger id="interest" className={errors.interest ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your interest area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kenya">{"Kenya"}</SelectItem>
                    <SelectItem value="east-africa">{"East Africa Regional"}</SelectItem>
                    <SelectItem value="technology">{"Sector-specific: Technology"}</SelectItem>
                    <SelectItem value="agriculture">{"Sector-specific: Agriculture"}</SelectItem>
                    <SelectItem value="infrastructure">{"Sector-specific: Infrastructure"}</SelectItem>
                    <SelectItem value="finance">{"Sector-specific: Financial Services"}</SelectItem>
                    <SelectItem value="other">{"Other"}</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage message={errors.interest} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {"Message"} <span className="text-destructive">{"*"}</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your investment goals and how we can help..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message && e.target.value.trim()) {
                      setErrors({ ...errors, message: undefined })
                    }
                  }}
                  className={errors.message ? "border-destructive" : ""}
                />
                <ErrorMessage message={errors.message} />
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, consent: checked as boolean })
                      if (errors.consent && checked) {
                        setErrors({ ...errors, consent: undefined })
                      }
                    }}
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                    {
                      "I consent to The Oxic International Group processing my personal data for the purpose of responding to my enquiry. We respect your privacy and comply with GDPR regulations."
                    }
                  </Label>
                </div>
                <ErrorMessage message={errors.consent} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
