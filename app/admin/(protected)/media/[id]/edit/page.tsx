"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, Loader2, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ImageUpload } from "@/components/image-upload"

import { MEDIA_CATEGORIES } from "@/lib/constants"

export default function EditMediaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    video_id: "",
    category: "",
    image_url: "",
  })

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("media").select("*").eq("id", id).single()

        if (error) throw error
        if (data) {
          setFormData({
            title: data.title || "",
            video_id: data.video_id || "",
            category: data.category || "",
            image_url: data.image_url || "",
          })
        }
      } catch (error) {
        console.error("Error fetching media:", error)
        alert("Failed to load media details")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMedia()
    }
  }, [id])

  // Helper to extract ID from URL if user pastes full link
  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = value.match(regExp)
    if (match && match[1].length === 11) {
      value = match[1]
    }
    setFormData({ ...formData, video_id: value })
  }

  const fetchYouTubeThumbnail = async (videoId: string): Promise<string> => {
    try {
      const res = await fetch(`/api/youtube-thumbnail?videoId=${videoId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.thumbnail_url) return data.thumbnail_url
      }
    } catch {}
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Use custom upload or auto-fetch from YouTube oEmbed if image_url is empty
      // But if we are editing, we might already have image_url, so only auto-fetch if it's missing or if the video ID changed and we don't have a custom image.
      // We'll just rely on the existing image_url if provided, otherwise fetch it.
      const image_url = formData.image_url || await fetchYouTubeThumbnail(formData.video_id)

      const { error } = await supabase.from("media").update({
        title: formData.title,
        video_id: formData.video_id,
        category: formData.category,
        image_url,
      }).eq("id", id)

      if (error) throw error
      router.push("/admin/media")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating media:", error)
      alert(`Failed to update media: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <Link
          href="/admin/media"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Media
        </Link>
        <h1 className="text-3xl font-bold">Edit Video</h1>
        <p className="text-muted-foreground">Update your video gallery entry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-lg border border-border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Video Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Construction Update: New Wing"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="video_id">YouTube Video ID (or URL) *</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Video className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="video_id"
                value={formData.video_id}
                onChange={handleVideoIdChange}
                placeholder="e.g. dQw4w9WgXcQ"
                className="pl-9"
                required
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Paste the video ID (11 characters) or the full YouTube URL.</p>
        </div>

        {formData.video_id && formData.video_id.length === 11 && !formData.image_url && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border">
            <Image
              src={`https://img.youtube.com/vi/${formData.video_id}/mqdefault.jpg`}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Default YouTube Thumbnail Preview</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Custom Thumbnail (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-2">Upload a custom thumbnail to override the default YouTube thumbnail.</p>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Category</option>
            {MEDIA_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Video...
              </>
            ) : (
              "Update Video"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
