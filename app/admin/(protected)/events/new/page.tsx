"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"
import Image from "next/image"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    short_description: string
    description: string
    image_url: string
    year: number
    status: string
    gallery_images: string[]
  }>({
    title: "",
    short_description: "",
    description: "",
    image_url: "",
    year: new Date().getFullYear(),
    status: "completed",
    gallery_images: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number.parseInt(value) : value,
    }))
  }

  const handleAddGalleryImage = (url: string) => {
    if (url) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, url]
      }))
    }
  }

  const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === formData.gallery_images.length - 1) return;

    setFormData(prev => {
      const newImages = [...prev.gallery_images];
      const swapIndex = direction === 'left' ? index - 1 : index + 1;
      [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
      return { ...prev, gallery_images: newImages };
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").insert([
        {
          ...formData,
          category: "Events",
          order_index: 0,
        },
      ])

      if (error) throw error
      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/events" className="text-primary hover:text-primary/80 mb-4 inline-block">
            ← Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Annual Developers Conference 2026"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">Ongoing</option>
                <option value="planned">Upcoming</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Short Description *</label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief event description (visible in listings)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Detailed event description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event Cover Image *</label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">Gallery Images</label>
            {formData.gallery_images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.gallery_images.map((url, index) => (
                  <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted group">
                    <Image
                      src={url}
                      fill
                      className="object-cover"
                      alt={`Gallery image ${index + 1}`}
                    />
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        type="button"
                        onClick={() => handleMoveGalleryImage(index, 'left')}
                        disabled={index === 0}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleMoveGalleryImage(index, 'right')}
                        disabled={index === formData.gallery_images.length - 1}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          gallery_images: prev.gallery_images.filter((_, i) => i !== index)
                        }))}
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-dashed border-border rounded-lg p-4 bg-muted/20">
              <span className="text-sm font-medium text-muted-foreground block mb-2">Add Gallery Image</span>
              <ImageUpload
                value=""
                onChange={handleAddGalleryImage}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/events">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
