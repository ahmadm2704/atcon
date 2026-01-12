"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { createClient } from "@/lib/supabase"

interface Project {
  id: string
  title: string
  short_description: string
  image_url: string
  category?: string
  year?: number
}

const CATEGORIES = [
  "Residential",
  "Military",
  "Mechanical Works",
  "PEB Buildings",
  "Highways",
  "Educational",
  "Sports",
  "Religious",
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createClient()
        let query = supabase.from("projects").select("*").order("order_index", { ascending: true })

        if (selectedCategory) {
          query = query.eq("category", selectedCategory)
        }

        const { data, error } = await query

        if (error) throw error

        setProjects(data || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [selectedCategory])

  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 pt-32 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Projects Undertaken</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Explore our portfolio of innovative architectural and development projects across various categories.
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
            All Projects
          </button>
          {CATEGORIES.map((category) => (
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

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                shortDescription={project.short_description}
                imageUrl={project.image_url}
                category={project.category}
                year={project.year}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-foreground/50">No projects found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
