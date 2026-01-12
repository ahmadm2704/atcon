"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase"
import { X } from "lucide-react"

interface MediaItem {
  id: string
  title: string
  image_url: string
  description?: string
  category?: string
  featured?: boolean
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const supabase = createClient()
        let query = supabase.from("media").select("*").order("order_index", { ascending: true })

        if (selectedCategory) {
          query = query.eq("category", selectedCategory)
        }

        const { data, error } = await query

        if (error) throw error
        setMediaItems(data || [])

        // Fetch unique categories
        const { data: allMedia } = await supabase.from("media").select("category")
        const uniqueCategories = [...new Set(allMedia?.map((m) => m.category).filter(Boolean))] as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [selectedCategory])

  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 pt-32 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Media & Gallery</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Explore our collection of architectural photography, project renderings, and design inspiration.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary text-foreground/70 hover:text-primary"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:border-primary text-foreground/70 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : mediaItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative h-64 rounded-lg overflow-hidden bg-muted cursor-pointer"
              >
                <Image
                  src={item.image_url || "/placeholder.svg?height=400&width=400&query=architecture photography"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    {item.category && <p className="text-xs text-white/70">{item.category}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-foreground/50">No media items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative flex-1 min-h-0 bg-black rounded-lg overflow-hidden">
              <Image
                src={selectedImage.image_url || "/placeholder.svg?height=800&width=1200&query=architecture"}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              {selectedImage.category && <p className="text-sm text-white/70 mb-2">{selectedImage.category}</p>}
              {selectedImage.description && <p className="text-white/80">{selectedImage.description}</p>}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
