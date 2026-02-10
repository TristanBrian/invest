"use client"

import React from "react"
import { MapPin } from "lucide-react"

export function LocationMap() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">{"Visit Us"}</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {"Located at The Beacon Mall in Nairobi, Kenya - East Africa's premier investment hub"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-lg mb-2">{"The Beacon Mall"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {"Nairobi's most prestigious business location"}
              </p>
              <a
                href="https://www.google.com/maps/place/The+Beacon/@-1.2949109,35.6562758,178617m/data=!3m1!1e3!4m10!1m2!2m1!1sThe+Beacon+Mall!3m6!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                {"View on Google Maps →"}
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-lg mb-2">{"Hours"}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{"Monday - Friday: 8:00 AM - 6:00 PM"}</p>
                <p>{"Saturday: 9:00 AM - 5:00 PM"}</p>
                <p>{"Sunday: By Appointment"}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-lg mb-2">{"Get Directions"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {"Nairobi, Kenya"}
              </p>
              <a
                href="tel:+254748992777"
                className="inline-block text-primary hover:text-primary/80 font-medium text-sm transition-colors"
              >
                {"Call us for directions →"}
              </a>
            </div>
          </div>

          <div className="w-full rounded-lg overflow-hidden border border-border shadow-lg aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8236481547004!2d36.80957532346897!3d-1.2949109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f110017e5672d%3A0xd91cca1e1bf61235!2sThe%20Beacon!5e0!3m2!1sen!2ske!4v1707123456789"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Beacon Mall - The Oxic International Group Location"
            />
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-2">{"Ready to invest in your future?"}</h3>
            <p className="text-muted-foreground mb-6">
              {"Visit us at The Beacon Mall or schedule a virtual consultation with our investment advisors"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.google.com/maps/place/The+Beacon/@-1.2949109,35.6562758,178617m/data=!3m1!1e3!4m10!1m2!2m1!1sThe+Beacon+Mall!3m6!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {"Get Directions"}
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-background border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                {"Schedule Consultation"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
