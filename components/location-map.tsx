"use client"

import React, { useState } from "react"

export function LocationMap() {
  const [showMap, setShowMap] = useState(false)

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{"Our Location"}</h2>
            <p className="text-muted-foreground text-sm">{"The Beacon Mall, Nairobi, Kenya"}</p>
          </div>

          {/* Map Container */}
          {!showMap ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-video bg-muted rounded-xl border border-border flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">{"Click below to view location on map"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(true)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {"Get Location"}
              </button>
            </div>
          ) : (
            <div className="w-full rounded-xl overflow-hidden border border-border shadow-lg aspect-video">
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
          )}
        </div>
      </div>
    </section>
  )
}
