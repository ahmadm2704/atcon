"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Media {
  id: string
  title: string
  video_id: string
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
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

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
            <p className="text-foreground/60">Manage your video gallery</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/media/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : mediaItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="group relative bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                <div className="relative aspect-video bg-muted">
                  {item.video_id ? (
                    <Image
                      src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Video className="w-8 h-8 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={`https://www.youtube.com/watch?v=${item.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline text-sm font-medium"
                    >
                      View on YouTube
                    </a>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-bold text-foreground line-clamp-1">{item.title}</h3>
                  {item.category && <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.category}</p>}
                </div>

                <div className="p-4 pt-0 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-lg">
            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-6">Add your first YouTube video to the gallery</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/media/new">Add Video</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
