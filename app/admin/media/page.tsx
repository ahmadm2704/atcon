"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Media {
  id: string
  title: string
  image_url: string
  category?: string
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("media").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setMediaItems(data || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("media").delete().eq("id", id)

      if (error) throw error
      setMediaItems(mediaItems.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Error deleting media:", error)
      alert("Failed to delete media")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Media</h1>
            <p className="text-foreground/60">Manage your gallery images and media</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/media/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : mediaItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{item.title}</h3>
                  {item.category && <p className="text-xs text-foreground/60">{item.category}</p>}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60 mb-4">No media items yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/media/new">Add First Media</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
