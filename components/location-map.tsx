'use client'

import React, { useState } from "react"
import { MapPin, Navigation, ExternalLink, X, Clock, Phone, Globe } from "lucide-react"
import Image from "next/image"

export function LocationMap() {
  const [showModal, setShowModal] = useState(false)
  
  const googleMapsLink = "https://www.google.com/maps/place/The+Beacon/@-1.2949109,35.6562758,178617m/data=!3m1!1e3!4m10!1m2!2m1!1sThe+Beacon+Mall!3m6!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403"

  const openGoogleMaps = () => {
    window.open(googleMapsLink, "_blank")
  }

  const getDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("The Beacon Mall Nairobi")}`, "_blank")
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Side - Visual */}
                <div className="flex flex-col justify-center">
                  <div className="text-center md:text-left">
                    <div className="w-20 h-20 mx-auto md:mx-0 mb-6 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/50">
                      <MapPin className="h-10 w-10 text-primary" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{"The Beacon Mall"}</h3>
                    <p className="text-muted-foreground mb-6">{"One of Nairobi's premier business destinations"}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{"Open Mon-Fri: 8AM - 6PM"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{"+254 748 992 777"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex flex-col justify-center">
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <MapPin className="h-6 w-6" />
                      {"View on Map"}
                    </button>
                    
                    <button
                      onClick={getDirections}
                      className="w-full py-4 border-2 border-primary text-primary bg-white rounded-xl font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      <Navigation className="h-6 w-6" />
                      {"Get Directions"}
                    </button>
                    
                    <button
                      onClick={openGoogleMaps}
                      className="w-full py-4 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all flex items-center justify-center gap-3"
                    >
                      <Globe className="h-5 w-5" />
                      {"Open in Google Maps"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-md bg-background rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{"View on Map"}</h3>
                    <p className="text-sm text-muted-foreground">{"Choose an option below"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                  <p className="font-medium mb-1">📍 <strong>The Beacon Mall</strong></p>
                  <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      openGoogleMaps()
                      setShowModal(false)
                    }}
                    className="w-full p-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5" />
                      <span>{"Open Google Maps"}</span>
                    </div>
                    <span className="text-sm opacity-70 group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => {
                      getDirections()
                      setShowModal(false)
                    }}
                    className="w-full p-4 border-2 border-primary text-primary bg-white rounded-lg font-semibold hover:bg-primary/5 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Navigation className="h-5 w-5" />
                      <span>{"Get Directions"}</span>
                    </div>
                    <span className="text-sm opacity-70 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                {/* Quick Info */}
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Quick Info:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium mb-1">Hours</p>
                      <p className="text-muted-foreground">Mon-Fri: 8AM-6PM</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-medium mb-1">Phone</p>
                      <p className="text-muted-foreground">+254 748 992 777</p>
                    </div>
                  </div>
                </div>

                {/* Alternative Option */}
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {"Prefer to copy the address? "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("The Beacon Mall, Nairobi, Kenya")
                        setShowModal(false)
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      {"Copy Address"}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="text-center text-sm text-muted-foreground">
                <p>Clicking an option will open Google Maps in a new tab</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
