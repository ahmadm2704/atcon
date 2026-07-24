"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { Star, Quote, Play } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { VideoCard } from "@/components/video-card"

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

export default function ReviewsPage() {
  const [data, setData] = useState<PlaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [videoReviews, setVideoReviews] = useState<any[]>([])
  const [videosLoading, setVideosLoading] = useState(true)

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

  useEffect(() => {
    if (!data?.reviews?.length) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.reviews.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [data])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const supabase = createClient()
        const { data: videos, error } = await supabase
          .from("media")
          .select("*")
          .eq("category", "Client Reviews")
          .order("order_index", { ascending: true })

        if (error) throw error
        setVideoReviews(videos || [])
      } catch (error) {
        console.error("Failed to fetch video reviews:", error)
      } finally {
        setVideosLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Client Reviews"
        description="See what our clients have to say about working with ATCON Engineers."
        backgroundImage="/hero1.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : data?.reviews && data.reviews.length > 0 ? (
          <div className="space-y-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
              <div className="flex items-center gap-2 bg-card border border-border shadow-sm px-6 py-3 rounded-full">
                <span className="text-3xl font-bold">{data.rating}</span>
                <div className="flex text-amber-400 mx-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < Math.round(data.rating) ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-medium border-l border-border pl-4">
                  Based on {data.user_ratings_total} Reviews
                </span>
              </div>
            </div>

            <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden" style={{ perspective: 1200 }}>
              <AnimatePresence mode="popLayout">
                {data.reviews.map((review, index) => {
                  const len = data.reviews.length
                  let offset = index - currentIndex
                  // Handle infinite wrap-around
                  if (offset < -Math.floor(len / 2)) offset += len
                  if (offset > Math.floor(len / 2)) offset -= len

                  // Only show 5 items (-2, -1, 0, 1, 2) to improve performance and look
                  if (Math.abs(offset) > 2) return null

                  const isCenter = offset === 0
                  const direction = Math.sign(offset)
                  
                  // Calculate 3D transforms
                  const x = offset * 280
                  const z = -Math.abs(offset) * 200
                  const rotateY = offset * -20
                  const scale = isCenter ? 1 : 0.85
                  const opacity = isCenter ? 1 : 1 - Math.abs(offset) * 0.4
                  const zIndex = 10 - Math.abs(offset)

                  return (
                    <motion.div
                      key={review.author_name + index}
                      initial={false}
                      animate={{ x, z, rotateY, scale, opacity, zIndex }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformStyle: "preserve-3d" }}
                      className={`absolute w-full max-w-[400px] bg-card dark:bg-card border border-border rounded-3xl p-8 flex flex-col cursor-pointer transition-shadow duration-500 ${isCenter ? 'shadow-2xl shadow-primary/20' : 'shadow-lg'}`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] transition-opacity">
                          <Quote className="w-32 h-32" />
                      </div>
                      
                      <div className="flex text-amber-400 mb-6 relative z-10">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < review.rating ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"}`} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-foreground/90 mb-8 flex-grow leading-relaxed relative z-10 italic line-clamp-6 text-sm md:text-base">
                        "{review.text}"
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-border/50">
                        <img 
                          src={review.profile_photo_url} 
                          alt={review.author_name} 
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-foreground">{review.author_name}</h4>
                          <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                        </div>
                        <div className="ml-auto">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-70">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No reviews available at the moment.</p>
          </div>
        )}
      </div>

      {/* Video Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase tracking-wider mb-4">Video Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear directly from our clients about their experience working with ATCON Engineers.
            </p>
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : videoReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoReviews.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  videoId={video.video_id || ""}
                  thumbnailUrl={video.image_url}
                  category={video.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-3xl shadow-sm">
              <Play className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Video testimonials coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
