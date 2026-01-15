"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
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
        title="Projects Undertaken"
        description="Explore our portfolio of innovative architectural and development projects across various categories."
        backgroundImage="/hero1.jpg"
      />

      {/* Premium Floating Filters */}
      <div className="sticky top-24 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pointer-events-none">
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
                layoutId="activePill"
                className="absolute inset-0 bg-primary z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">All Projects</span>
          </button>

          {CATEGORIES.map((category) => (
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
                  layoutId="activePill"
                  className="absolute inset-0 bg-primary z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            key={selectedCategory || "all"}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  shortDescription={project.short_description}
                  imageUrl={project.image_url}
                  category={project.category}
                  year={project.year}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-foreground/50">No projects found in this category.</p>
          </div>
        )}
      </div>
    </main >
  )
}
