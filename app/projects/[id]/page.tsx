"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
      <main>
        <Navigation />
        <div className="h-96 bg-muted animate-pulse" />
        <Footer />
      </main>
    )
  }

  if (!project) {
    return (
      <main>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <Link href="/projects" className="text-primary hover:underline mt-4 inline-block">
            Back to Projects
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navigation />

      {/* Hero Image */}
      <div className="relative w-full h-96 md:h-screen pt-20 bg-muted overflow-hidden">
        <Image
          src={project.image_url || "/placeholder.svg?height=800&width=1200&query=architecture"}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          href="/projects"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project Info */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            {project.category && (
              <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1 rounded-full w-fit">
                {project.category}
              </span>
            )}
            {project.year && <span className="text-sm text-foreground/60">{project.year}</span>}
            {project.status && <span className="text-sm text-foreground/60 capitalize">{project.status}</span>}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">{project.title}</h1>
          <p className="text-lg text-foreground/70 leading-relaxed">{project.description}</p>
        </div>

        {/* Gallery */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery_images.map((image, idx) => (
                <div key={idx} className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image || "/placeholder.svg?height=500&width=500&query=architecture detail"}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
