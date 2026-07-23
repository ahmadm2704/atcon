"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { ProjectCard } from "@/components/project-card"
import { createClient } from "@/lib/supabase"

interface Event {
  id: string
  title: string
  short_description: string
  image_url: string
  year?: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("category", "Events")
          .order("order_index", { ascending: true })

        if (error) throw error

        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

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
        title="Events & Exhibitions"
        description="Explore the various events and exhibitions we have organized or attended over the years."
        backgroundImage="/hero1.jpg"
      />

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <ProjectCard
                  id={event.id}
                  title={event.title}
                  shortDescription={event.short_description}
                  imageUrl={event.image_url}
                  category="Event"
                  year={event.year}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-foreground/50">No events found.</p>
          </div>
        )}
      </div>
    </main>
  )
}
