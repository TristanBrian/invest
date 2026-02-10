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
    text: "Exceptional investment advisory services with tailored solutions that delivered excellent returns.",
    verified: true,
  },
  {
    id: "2",
    author: "Sarah K.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    text: "Outstanding guidance on investment opportunities. Their market insights are invaluable and highly recommended.",
    verified: true,
  },
  {
    id: "3",
    author: "James O.",
    location: "Kampala, Uganda",
    rating: 5,
    text: "Very impressed with comprehensive analysis and strategic recommendations. Unparalleled regional market knowledge.",
    verified: true,
  },
  {
    id: "4",
    author: "Patricia N.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Professional and results-driven team. They helped me diversify successfully with transparent communication.",
    verified: true,
  },
  {
    id: "5",
    author: "Michael P.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Best investment advisory firm. Their commitment to client success is evident in every interaction.",
    verified: true,
  },
  {
    id: "6",
    author: "Angela T.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Oxic identified high-potential opportunities I wouldn't have found alone. Expertise spans multiple sectors.",
    verified: true,
  },
]

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockReviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoPlay])

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
    <section className="py-16 md:py-20 bg-muted/30" id="reviews">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">{"Client Testimonials"}</h2>
            <p className="text-muted-foreground">{"Trusted by investors across East Africa"}</p>
            
            {/* Rating Summary */}
            <div className="flex flex-col items-center justify-center gap-2 mt-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {"5.0 out of 5 based on"} <span className="font-semibold">{mockReviews.length}</span> {" reviews"}
              </p>
            </div>
          </div>

          {/* Main Carousel */}
          <div className="relative">
            {/* Current Featured Review */}
            <div className="bg-background border border-border rounded-xl p-8 md:p-10 mb-8 min-h-[300px] flex flex-col justify-between">
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
            <div className="flex gap-3 overflow-x-auto pb-2">
              {visibleIndices.map((index) => {
                const review = mockReviews[index]
                const isActive = index === currentIndex
                return (
                  <button
                    key={review.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } p-3 cursor-pointer`}
                  >
                    <div className="text-center h-full flex flex-col justify-between">
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs font-semibold line-clamp-2">{review.author}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {mockReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50 w-2"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              {"Get Investment Advice"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
