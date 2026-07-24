"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, Calendar, Tag, Activity, ZoomIn, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  gallery_images: string[]
  category?: string
  year?: number
  status?: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

        if (error) throw error
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen">
        <Navigation />
        <div className="flex flex-col space-y-6 pt-32 max-w-7xl mx-auto px-4">
          <div className="h-96 w-full bg-muted animate-pulse rounded-xl" />
          <div className="h-10 w-1/3 bg-muted animate-pulse rounded-md" />
          <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!project) {
    return (
      <main className="bg-background min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground">Project not found</h1>
          <p className="text-muted-foreground mt-2">The project you are looking for might have been removed or doesn't exist.</p>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen font-sans">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden pt-20 bg-black">
        <Image
          src={project.image_url || "/placeholder.svg"}
          alt={project.title}
          fill
          priority
          className="object-cover opacity-80"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Banner Content (Bottom Aligned) */}
        <div className="absolute bottom-0 left-0 w-full pb-12 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-white/80 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
              
              <div className="flex flex-wrap items-center gap-3">
                {project.category && (
                  <span className="text-xs font-bold tracking-widest uppercase bg-primary text-white px-3 py-1 rounded-sm">
                    {project.category}
                  </span>
                )}
                {project.status && (
                  <span className="text-xs font-bold tracking-widest uppercase bg-white/10 text-white border border-white/20 backdrop-blur px-3 py-1 rounded-sm">
                    {project.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white uppercase tracking-tight leading-none drop-shadow-2xl">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left/Middle Columns: Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-primary font-bold tracking-widest uppercase text-sm block">Project Overview</span>
                <h2 className="text-3xl font-heading font-bold text-foreground">ABOUT THE PROJECT</h2>
                <div className="w-20 h-1 bg-primary" />
              </div>
              
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty font-light whitespace-pre-line">
                {project.description}
              </div>
            </motion.div>

            {/* Right Column: Metadata Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-card border border-border rounded-xl p-8 shadow-xl space-y-6">
                <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-4">PROJECT INFO</h3>
                
                <div className="space-y-4">
                  {project.category && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Category</span>
                        <span className="text-sm font-bold text-foreground">{project.category}</span>
                      </div>
                    </div>
                  )}

                  {project.year && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Year Completed</span>
                        <span className="text-sm font-bold text-foreground">{project.year}</span>
                      </div>
                    </div>
                  )}

                  {project.status && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">Status</span>
                        <span className="text-sm font-bold text-foreground capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lightbox / Gallery */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-24"
            >
              <div className="mb-12">
                <span className="text-primary font-bold tracking-widest uppercase text-sm block">Gallery</span>
                <h2 className="text-3xl font-heading font-bold text-foreground">PROJECT GALLERY</h2>
                <div className="w-20 h-1 bg-primary mt-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {project.gallery_images.map((image, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(image)}
                    className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-border bg-muted cursor-pointer group shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} Gallery ${idx + 1}`}
                      fill
                      className="object-fill transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Glassmorphic hover overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <div className="p-3 rounded-full bg-white/20 border border-white/30 text-white">
                        <ZoomIn className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeImage}
                  alt="Gallery full-screen"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
