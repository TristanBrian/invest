'use client'

import React, { useState } from "react"
import { X } from "lucide-react"

export function LocationMap() {
  const [showMap, setShowMap] = useState(false)

  // Proper Google Maps embed URL for The Beacon Mall, Nairobi
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.818478!2d36.8098403!3d-1.2949109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f110017e5672d%3A0xd91cca1e1bf61235!2sThe%20Beacon!5e0!3m2!1sen!2ske!4v1707123456789"

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{"Our Location"}</h2>
            <p className="text-muted-foreground mb-8">{"The Beacon Mall, Nairobi, Kenya"}</p>
          </div>

          {/* Interactive Preview and Modal */}
          <div className="flex flex-col items-center gap-4">
            {/* Preview Card */}
            <div 
              className="w-full max-w-4xl bg-muted rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setShowMap(true)}
            >
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{"Visit Our Office"}</h3>
                  <p className="text-muted-foreground mb-4">{"Click to view our location on Google Maps"}</p>
                </div>
                
                <div className="bg-background p-6 rounded-lg border border-border max-w-md w-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{"The Beacon Mall"}</h4>
                      <p className="text-sm text-muted-foreground">{"Nairobi, Kenya"}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    {"View on Map"}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{"Click above to view our location on an interactive map"}</p>
          </div>
        </div>
      </div>

      {/* Modal for Map */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-background rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-background">
              <div>
                <h3 className="text-xl font-bold">{"Our Location"}</h3>
                <p className="text-muted-foreground text-sm">{"The Beacon Mall, Nairobi, Kenya"}</p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close map"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Map Container */}
            <div className="w-full aspect-video">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Beacon Mall - The Oxic International Group Location"
                className="h-full w-full"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-background">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">📍 <strong>The Beacon Mall</strong></p>
                  <p>Nairobi, Kenya</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=The+Beacon+Mall+Nairobi", "_blank")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                  >
                    {"Get Directions"}
                  </button>
                  <button
                    onClick={() => setShowMap(false)}
                    className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors text-sm"
                  >
                    {"Close Map"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
