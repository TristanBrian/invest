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
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50" id="reviews">
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

        <div className="space-y-12">
          {/* Main Carousel Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Review - Left */}
            <div 
              onClick={() => openReviewModal(mockReviews[currentIndex])}
              className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8 cursor-pointer group hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-200 group-hover:text-blue-300 transition-colors" />
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 line-clamp-4">
                "{mockReviews[currentIndex].text}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-blue-100">
                <div className={`w-12 h-12 rounded-xl ${getAvatarColor(mockReviews[currentIndex].avatar?.[0] || 'A')} flex items-center justify-center text-white font-bold`}>
                  {mockReviews[currentIndex].avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{mockReviews[currentIndex].author}</h4>
                    {mockReviews[currentIndex].verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-3 w-3" />
                    <span>{mockReviews[currentIndex].location}</span>
                    <span className="text-gray-400">•</span>
                    <span>{mockReviews[currentIndex].date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Navigation - Right */}
            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Client Satisfaction</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">5.0</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Verified Clients</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Browse Reviews</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPrevious}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Next review"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">Click on reviews to read more</p>
                <div className="flex gap-2">
                  {mockReviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Review Thumbnails Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleIndices.map((index) => {
              const review = mockReviews[index]
              const isCurrent = index === currentIndex
              return (
                <button
                  key={review.id}
                  onClick={() => openReviewModal(review)}
                  className={`group relative bg-white border rounded-xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
                    isCurrent 
                      ? 'border-blue-300 shadow-md ring-1 ring-blue-100' 
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {/* Badge for current review */}
                  {isCurrent && (
                    <span className="absolute -top-2 -right-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Current
                    </span>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${getAvatarColor(review.avatar?.[0] || 'A')} flex items-center justify-center text-white font-medium text-sm`}>
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-sm">{review.author}</h4>
                        {review.verified && (
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-gray-800 transition-colors">
                    "{review.text}"
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
                    <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Read full review →
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center pt-8">
            <div className="inline-flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full ${getAvatarColor(String.fromCharCode(65 + i))} flex items-center justify-center text-white font-medium`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
                  +{mockReviews.length - 4}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Ready to join our satisfied clients?</h3>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <User className="h-5 w-5" />
                  Start Your Investment Journey
                </a>
              </div>
            </div>
          </div>
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
