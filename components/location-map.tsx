'use client'

import React, { useState } from "react"
import { Navigation, MapPin, Clock, Phone, ChevronRight, X } from "lucide-react"

export function LocationMap() {
  const [isHovering, setIsHovering] = useState(false)
  
  // Your exact Google Maps link
  const googleMapsLink = "https://www.google.com/maps/place/The+Beacon/@-1.2949109,35.6562758,178617m/data=!3m1!1e3!4m10!1m2!2m1!1sThe+Beacon+Mall!3m6!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403!15sCg9UaGUgQmVhY29uIE1hbGxaESIPdGhlIGJlYWNvbiBtYWxskgEPc2hvcHBpbmdfY2VudGVymgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDIxV05sWllhRUpSYlRsR1UwVldNR013Vm5oa01VWTJWbFpPVUZaV1JSQULgAQD6AQQIABAh!16s%2Fg%2F11wn5d38dh?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"

  const handleGetDirections = () => {
    window.open(googleMapsLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              📍 Find Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Our <span className="text-blue-600">Office</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Located at The Beacon Mall, one of Nairobi's premier business and shopping destinations
            </p>
          </div>

          {/* Main Card */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">The Beacon Mall</h3>
                    <p className="text-blue-600 font-medium">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Prime Location</p>
                      <p className="text-sm text-muted-foreground">
                        Situated in Nairobi's vibrant business district with easy access to major roads and amenities
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Hours</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mon-Fri: 8AM-6PM<br />
                        Sat: 9AM-2PM<br />
                        Sun: Closed
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Contact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        +254 748 992 777<br />
                        info@oxicinternational.co.ke
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-1">🚗</div>
                  <p className="text-xs font-medium">Ample Parking</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-1">🏪</div>
                  <p className="text-xs font-medium">Shopping Mall</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-1">☕</div>
                  <p className="text-xs font-medium">Food & Dining</p>
                </div>
              </div>
            </div>

            {/* Right Side - CTA & Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 h-full shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Ready to Visit?
                    </h3>
                    <p className="text-blue-100 mb-8">
                      Click below to open Google Maps with our exact location.
                    </p>

                    {/* Distance Info */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 font-medium">Estimated Travel Times:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <p className="text-white font-medium">From CBD</p>
                          <p className="text-blue-200">15-20 min</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <p className="text-white font-medium">From Airport</p>
                          <p className="text-blue-200">30-40 min</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Get Directions Button */}
                    <button
                      onClick={handleGetDirections}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full group relative bg-white text-blue-700 rounded-xl p-5 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between overflow-hidden"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Navigation className="h-6 w-6 text-blue-700" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Get Directions</div>
                          <div className="text-sm font-normal text-blue-600">
                            Opens Google Maps
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${isHovering ? 'translate-x-2' : ''}`} />
                      
                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                    
              
              {/* Decorative Element */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg transform rotate-12 flex items-center justify-center">
                <span className="text-white font-bold text-sm text-center">Easy<br />Access</span>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Available for meetings Monday through Friday, 8:00 AM to 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
