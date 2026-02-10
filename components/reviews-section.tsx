"use client"

import React, { useState } from "react"
import { Star, User, MapPin, Calendar } from "lucide-react"

interface Review {
  id: string
  author: string
  location: string
  rating: number
  date: string
  text: string
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "David M.",
    location: "Nairobi, Kenya",
    rating: 5,
    date: "2 weeks ago",
    text: "Exceptional investment advisory services. The team at Oxic understood my financial goals and provided tailored solutions that have already shown excellent returns. Highly professional and trustworthy.",
    verified: true,
  },
  {
    id: "2",
    author: "Sarah K.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    date: "1 month ago",
    text: "Outstanding guidance on investment opportunities across East Africa. Their market insights are invaluable. I've recommended them to several business associates.",
    verified: true,
  },
  {
    id: "3",
    author: "James O.",
    location: "Kampala, Uganda",
    rating: 5,
    date: "3 weeks ago",
    text: "Very impressed with the comprehensive analysis and strategic recommendations. The team's knowledge of regional markets is unparalleled. Definitely worth consulting.",
    verified: true,
  },
  {
    id: "4",
    author: "Patricia N.",
    location: "Nairobi, Kenya",
    rating: 5,
    date: "1 month ago",
    text: "Professional, knowledgeable, and results-driven. They helped me diversify my portfolio successfully. The communication throughout was transparent and timely.",
    verified: true,
  },
  {
    id: "5",
    author: "Michael P.",
    location: "Kigali, Rwanda",
    rating: 5,
    date: "2 weeks ago",
    text: "Best investment advisory firm I've worked with. Their commitment to client success is evident in every interaction. Highly recommend for serious investors.",
    verified: true,
  },
  {
    id: "6",
    author: "Angela T.",
    location: "Nairobi, Kenya",
    rating: 5,
    date: "3 weeks ago",
    text: "Oxic helped me identify high-potential investment opportunities I wouldn't have found alone. Their expertise spans multiple sectors across East Africa.",
    verified: true,
  },
]

export function ReviewsSection() {
  const [visibleReviews, setVisibleReviews] = useState(3)
  const averageRating = 5.0
  const totalReviews = mockReviews.length

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{"Client Testimonials"}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {"Trusted by investors across East Africa for strategic investment guidance and market expertise"}
            </p>

            {/* Rating Summary */}
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{averageRating}</span>
                <span className="text-muted-foreground">{"out of 5"}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {"Based on"} <span className="font-semibold">{totalReviews}</span> {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockReviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow space-y-4"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-foreground leading-relaxed">
                  {review.text}
                </p>

                {/* Author Info */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {review.author}
                        {review.verified && (
                          <span className="ml-2 inline-block text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            ✓ Verified
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {review.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {review.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleReviews < mockReviews.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleReviews((prev) => Math.min(prev + 3, mockReviews.length))}
                className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                {"Load More Reviews"}
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-2">{"Share Your Experience"}</h3>
            <p className="text-muted-foreground mb-6">
              {"Have you worked with us? We'd love to hear about your investment journey with Oxic International Group"}
            </p>
            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {"Contact Us Today"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
