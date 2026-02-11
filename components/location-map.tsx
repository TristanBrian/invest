'use client'

import React from "react"
import { Navigation, MapPin, Clock, Phone } from "lucide-react"

export function LocationMap() {
  const googleMapsLink = "https://www.google.com/maps/place/The+Beacon/@-1.2949109,35.6562758,178617m/data=!3m1!1e3!4m10!1m2!2m1!1sThe+Beacon+Mall!3m6!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403"

  const handleGetDirections = () => {
    window.open(googleMapsLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{"Our Location"}</h2>
            <p className="text-muted-foreground mb-8">{"The Beacon Mall, Nairobi, Kenya"}</p>
          </div>

          {/* Location Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/50">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-2">{"Find Us Here"}</h3>
                <p className="text-muted-foreground mb-8">{"Get directions to our office at The Beacon Mall"}</p>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">Address</span>
                    </div>
                    <p className="text-sm text-muted-foreground">The Beacon Mall<br />Nairobi, Kenya</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Business Hours</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 8AM - 6PM<br />Sat: 9AM - 2PM</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">Contact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+254 748 992 777</p>
                </div>

                {/* Get Directions Button */}
                <button
                  onClick={handleGetDirections}
                  className="w-full max-w-xs mx-auto py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Navigation className="h-6 w-6" />
                  {"Get Directions"}
                </button>

                {/* Helper Text */}
                <p className="text-sm text-muted-foreground mt-4">
                  {"Clicking will open Google Maps in a new tab"}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>📍 Located in one of Nairobi's premier business districts</p>
              <p className="mt-1">🚗 Ample parking available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
