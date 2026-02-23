"use client"

import React, { useState } from "react"
import { Navigation, MapPin, Clock, Phone, ChevronRight } from "lucide-react"

export function LocationMap() {
  const [isHovering, setIsHovering] = useState(false)

  // Exact coordinates: The Beacon Mall, Nairobi
  const beaconCoordinates = {
    lat: -1.2949109,
    lng: 36.8098403,
  }

  const googleMapsLink = `https://www.google.com/maps/place/${beaconCoordinates.lat},${beaconCoordinates.lng}?q=The+Beacon+Mall+Nairobi`

  const handleGetDirections = () => {
    if (typeof window !== "undefined") {
      window.open(googleMapsLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Visit Our <span className="text-blue-600">Office</span>
            </h2>
            <p className="text-muted-foreground">Located at The Beacon Mall, one of Nairobi's premier business and shopping destinations</p>
          </div>

          {/* Main Card */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Side - Information */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">The Beacon Mall</h3>
                    <p className="text-blue-600 text-sm font-medium">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Hours</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mon-Fri: 8AM-6PM<br />
                        Sat: 9AM-2PM<br />
                        Sun: Closed
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Contact</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +254 748 992 777<br />
                        info@oxicinternational.co.ke
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - CTA Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg relative overflow-hidden min-h-[280px] flex flex-col">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-24"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-20 -translate-x-20"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Visit?</h3>
                    <p className="text-blue-100 text-sm mb-5">Click below to open Google Maps with our exact location.</p>

                    {/* Travel Times */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-5">
                      <p className="text-blue-100 text-xs font-medium mb-3">Estimated Travel Times:</p>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-white font-medium text-xs">From CBD</p>
                          <p className="text-blue-200 text-sm">15-20 min</p>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-white font-medium text-xs">From Airport</p>
                          <p className="text-blue-200 text-sm">30-40 min</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Get Directions Button */}
                  <button
                    onClick={handleGetDirections}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="w-full group relative bg-white text-blue-700 rounded-lg p-4 font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Navigation className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm">Get Directions</div>
                        <div className="text-xs font-normal text-blue-600">Opens Google Maps</div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isHovering ? "translate-x-1" : ""}`} />
                  </button>
                </div>

                {/* Easy Access Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-12">
                  <span className="text-white font-bold text-xs text-center leading-tight">Easy<br />Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
