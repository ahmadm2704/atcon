"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { VideoCard } from "@/components/video-card"
import { createClient } from "@/lib/supabase"
import { X } from "lucide-react"

export default function MediaPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setVideos(data || [])
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Extract unique categories from videos
  const categories = Array.from(new Set(videos.map(v => v.category).filter(Boolean)))

  const filteredVideos = selectedCategory
    ? videos.filter(v => v.category === selectedCategory)
    : videos

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Media & Gallery"
        description="Experience our projects through immersive video tours and construction updates."
        backgroundImage="/hero3.jpg"
      />

      {/* Floating Filters */}
      <div className="sticky top-24 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl pointer-events-auto w-fit mx-auto"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 relative overflow-hidden ${selectedCategory === null
              ? "text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            {selectedCategory === null && (
              <motion.div
                layoutId="activeMediaPill"
                className="absolute inset-0 bg-primary z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">All Videos</span>
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 relative overflow-hidden ${selectedCategory === category
                ? "text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeMediaPill"
                  className="absolute inset-0 bg-primary z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <motion.div
            key={selectedCategory || "all"}
            layout
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                layout
                variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
              >
                <VideoCard
                  id={video.id}
                  title={video.title}
                  videoId={video.video_id}
                  category={video.category}
                  date={new Date(video.created_at).toLocaleDateString()}
                  duration="HD"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border/50 border-dashed">
            <p>No videos found for this category.</p>
          </div>
        )}

        <div className="mt-24 text-center">
          <div className="inline-block relative group">
            <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <a
              href="https://www.youtube.com/@atconengineersdevelopers3069"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FF0000] text-white font-bold hover:bg-[#D00000] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span className="mr-2">Subscribe on YouTube</span>
              {/* <X className="w-5 h-5 rotate-45" /> */}
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
