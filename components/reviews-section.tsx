"use client"

import React, { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface Review {
  id: string
  author: string
  location: string
  rating: number
  text: string
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "David M.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Working with Oxic transformed our investment approach. Their portfolio analysis was thorough and identified opportunities we'd completely missed. ROI exceeded projections by 35% in the first year.",
    verified: true,
  },
  {
    id: "2",
    author: "Sarah K.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    text: "The team provided exceptional market intelligence across East Africa. Their sector expertise and regulatory knowledge saved us from multiple costly mistakes. Highly recommend for any serious investor.",
    verified: true,
  },
  {
    id: "3",
    author: "James O.",
    location: "Kampala, Uganda",
    rating: 5,
    text: "Outstanding strategic guidance on expansion into new markets. Their due diligence process is comprehensive and their recommendations are data-driven. Professional, transparent, and results-oriented.",
    verified: true,
  },
  {
    id: "4",
    author: "Patricia N.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Exceptional diversification strategy that significantly reduced our portfolio risk. The team explained every step clearly and adjusted the approach as market conditions evolved. Outstanding service.",
    verified: true,
  },
  {
    id: "5",
    author: "Michael P.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Top-tier advisory firm with deep understanding of regional dynamics. They helped us structure a successful investment that generated consistent returns and opened doors for future growth.",
    verified: true,
  },
  {
    id: "6",
    author: "Angela T.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Identified high-growth opportunities in sectors we didn't fully understand. Their analytical approach and business acumen delivered measurable value. Invaluable partner for strategic planning.",
    verified: true,
  },
  {
    id: "7",
    author: "Robert K.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Expert navigation of complex regulatory environments across East Africa. Their knowledge of local market nuances and international best practices proved critical to our success.",
    verified: true,
  },
  {
    id: "8",
    author: "Grace M.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    text: "Our business achieved 300% growth within two years following their strategic recommendations. Their vision-setting and execution support were instrumental in scaling operations efficiently.",
    verified: true,
  },
  {
    id: "9",
    author: "Charles W.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Reliable partner for international expansion strategy. Their on-the-ground knowledge combined with global perspective made navigating new markets significantly less risky.",
    verified: true,
  },
  {
    id: "10",
    author: "Linda N.",
    location: "Kampala, Uganda",
    rating: 5,
    text: "Consistently delivers results that exceed expectations. The team's deep understanding of our market and industry dynamics provided critical competitive advantage.",
    verified: true,
  },
  {
    id: "11",
    author: "Andrew Z.",
    location: "Mombasa, Kenya",
    rating: 5,
    text: "Industry-leading risk management protocols and thorough due diligence. They transformed how we evaluate and structure investments. Professional and highly competent team.",
    verified: true,
  },
  {
    id: "12",
    author: "Fatima H.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    text: "Their investment recommendations proved accurate and profitable. Solid analytical framework minimized downside risk while capturing upside opportunities effectively.",
    verified: true,
  },
  {
    id: "13",
    author: "Vincent M.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Game-changing partnership that strengthened our investment strategy. Perfect blend of global expertise and deep local market knowledge. Essential advisor for ambitious businesses.",
    verified: true,
  },
]

export function ReviewsSection() {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!autoPlay || !mounted) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockReviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoPlay, mounted])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + mockReviews.length) % mockReviews.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % mockReviews.length)
  }

  const goToSlide = (index: number) => {
    setAutoPlay(false)
    setCurrentIndex(index)
  }

  const currentReview = mockReviews[currentIndex]
  const visibleReviews = 3
  const visibleIndices = Array.from({ length: visibleReviews }).map(
    (_, i) => (currentIndex + i) % mockReviews.length
  )

  return (
    <section className="py-8 md:py-10 bg-muted/30" id="reviews">
      <div className="container mx-auto px-4 md:px-6">
        {!mounted ? (
          <div className="space-y-4">
            <div className="h-8 bg-muted/40 rounded animate-pulse" />
            <div className="h-20 bg-muted/40 rounded animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold">{"Client Testimonials"}</h2>
              
              {/* Rating Summary */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {"5.0 - "} <span className="font-semibold">{mockReviews.length}</span> {" reviews"}
                </p>
              </div>
            </div>

            {/* Main Carousel */}
            {currentReview && (
              <div className="relative">
              {/* Current Featured Review */}
              <div className="bg-background border border-border rounded-lg p-6 mb-4 min-h-[220px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: currentReview.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed text-foreground">
                    {`"${currentReview.text}"`}
                  </p>
                </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  <p className="font-semibold text-sm">
                    {currentReview.author}
                    {currentReview.verified && (
                      <span className="ml-2 inline text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{currentReview.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {visibleIndices.map((index) => {
                const review = mockReviews[index]
                const isActive = index === currentIndex
                return (
                  <button
                    key={review.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } p-2 cursor-pointer`}
                  >
                    <div className="text-center h-full flex flex-col justify-between">
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs font-semibold line-clamp-2">{review.author}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {mockReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-primary/50 w-1.5"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="#contact"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-xs"
              >
                {"Get Advice"}
              </a>
            </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
