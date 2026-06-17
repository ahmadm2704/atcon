"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface Review {
  author_name: string
  author_url: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface PlaceData {
  name: string
  rating: number
  user_ratings_total: number
  reviews: Review[]
}

export function GoogleReviews() {
  const [data, setData] = useState<PlaceData | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews")
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-7xl animate-pulse">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl h-64 shadow-sm"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-primary"></div>
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">Client Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="font-bold text-xl mr-2">{data.rating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(data.rating) ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`} 
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2 text-sm border-l pl-2 border-gray-200 dark:border-gray-700">
                  Based on {data.user_ratings_total} Google Reviews
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white dark:bg-gray-800"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white dark:bg-gray-800"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {data.reviews.map((review, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full shadow-lg shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`} 
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8 flex-grow line-clamp-6 italic">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <img 
                      src={review.profile_photo_url} 
                      alt={review.author_name} 
                      className="w-12 h-12 rounded-full bg-gray-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{review.author_name}</h4>
                      <p className="text-xs text-gray-500">{review.relative_time_description}</p>
                    </div>
                    <div className="ml-auto">
                      {/* Google Logo minimal integration */}
                      <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-50">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
