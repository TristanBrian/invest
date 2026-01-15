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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.consent) {
      alert("Please accept the consent checkbox to proceed.")
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
      setIsSubmitting(false)
    }, 1000)
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {"Name"} <span className="text-destructive">{"*"}</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {"Email"} <span className="text-destructive">{"*"}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
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
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">
                  {"Investment Interest"} <span className="text-destructive">{"*"}</span>
                </Label>
                <Select
                  required
                  value={formData.interest}
                  onValueChange={(value) => setFormData({ ...formData, interest: value })}
                >
                  <SelectTrigger id="interest">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {"Message"} <span className="text-destructive">{"*"}</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your investment goals and how we can help..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  required
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                  {
                    "I consent to The Oxic International Group processing my personal data for the purpose of responding to my enquiry. We respect your privacy and comply with GDPR regulations."
                  }
                </Label>
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
