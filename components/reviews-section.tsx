'use client'

import React, { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, Quote, X, CheckCircle, Globe, User } from "lucide-react"

interface Review {
  id: string
  author: string
  location: string
  rating: number
  text: string
  verified: boolean
  date?: string
  avatar?: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "David M.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Exceptional investment advisory services with tailored solutions that delivered excellent returns. The team's expertise in East African markets is unparalleled.",
    verified: true,
    date: "Jan 2024",
    avatar: "DM",
  },
  {
    id: "2",
    author: "Sarah K.",
    location: "Dar es Salaam, Tanzania",
    rating: 5,
    text: "Outstanding guidance on investment opportunities. Their market insights are invaluable and highly recommended for anyone serious about investing in the region.",
    verified: true,
    date: "Dec 2023",
    avatar: "SK",
  },
  {
    id: "3",
    author: "James O.",
    location: "Kampala, Uganda",
    rating: 5,
    text: "Very impressed with comprehensive analysis and strategic recommendations. Unparalleled regional market knowledge that has significantly grown my portfolio.",
    verified: true,
    date: "Feb 2024",
    avatar: "JO",
  },
  {
    id: "4",
    author: "Patricia N.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Professional and results-driven team. They helped me diversify successfully with transparent communication throughout the entire investment process.",
    verified: true,
    date: "Nov 2023",
    avatar: "PN",
  },
  {
    id: "5",
    author: "Michael P.",
    location: "Kigali, Rwanda",
    rating: 5,
    text: "Best investment advisory firm in East Africa. Their commitment to client success is evident in every interaction and the impressive results speak for themselves.",
    verified: true,
    date: "Mar 2024",
    avatar: "MP",
  },
  {
    id: "6",
    author: "Angela T.",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Oxic identified high-potential opportunities I wouldn't have found alone. Expertise spans multiple sectors and their strategic advice is truly transformative.",
    verified: true,
    date: "Feb 2024",
    avatar: "AT",
  },
]

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!autoPlay || isModalOpen) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockReviews.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [autoPlay, isModalOpen])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + mockReviews.length) % mockReviews.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % mockReviews.length)
  }

  const openReviewModal = (review: Review) => {
    setSelectedReview(review)
    setIsModalOpen(true)
    setAutoPlay(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  const visibleReviews = 4
  const visibleIndices = Array.from({ length: visibleReviews }).map(
    (_, i) => (currentIndex + i) % mockReviews.length
  )

  const getAvatarColor = (initial: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-amber-500 to-amber-600",
      "bg-gradient-to-br from-rose-500 to-rose-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
    ]
    return colors[initial.charCodeAt(0) % colors.length]
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50" id="reviews">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Trusted by Investors
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our <span className="text-blue-600">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join hundreds of satisfied investors who've transformed their portfolios with our expert guidance
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300 group cursor-pointer"
              onClick={() => openReviewModal(review)}
            >
              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                "{review.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-9 h-9 rounded-lg ${getAvatarColor(review.avatar?.[0] || 'A')} flex items-center justify-center text-white text-xs font-bold`}>
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm text-gray-900">{review.author}</span>
                    {review.verified && (
                      <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Detail Modal */}
      {isModalOpen && selectedReview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Client Review</h3>
                  <p className="text-sm text-gray-600 mt-1">Verified testimonial</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl ${getAvatarColor(selectedReview.avatar?.[0] || 'A')} flex items-center justify-center text-white text-2xl font-bold`}>
                  {selectedReview.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold">{selectedReview.author}</h4>
                    {selectedReview.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {selectedReview.location}
                    </span>
                    <span>•</span>
                    <span>{selectedReview.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex gap-1 mb-6">
                {[...Array(selectedReview.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <div className="space-y-6">
                <Quote className="h-8 w-8 text-blue-200" />
                <p className="text-gray-700 leading-relaxed text-lg">
                  "{selectedReview.text}"
                </p>
                <Quote className="h-8 w-8 text-blue-200 rotate-180 ml-auto" />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Overall satisfaction
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">5.0</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={goToPrevious}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={goToNext}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
