"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { ProjectCard } from "@/components/project-card"
import { ArrowRight } from "lucide-react"

interface Project {
    id: string
    title: string
    description: string
    image_url: string
    category: string
    completion_year: number
}

export function ProjectsHomeSection() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(3)

                if (error) throw error
                setProjects(data || [])
            } catch (error) {
                console.error("Error fetching projects:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <section className="py-24 bg-background dark:bg-neutral-900 border-t border-border/5 dark:border-white/5 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Portfolio</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground dark:text-white">FEATURED PROJECTS</h2>
                        <div className="w-24 h-1 bg-primary mt-4" />
                    </div>
                    <Link
                        href="/projects"
                        className="group flex items-center gap-2 text-foreground dark:text-white font-bold hover:text-primary transition-colors uppercase tracking-widest text-sm"
                    >
                        View All Projects
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-card/20 rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="h-96">
                                <ProjectCard
                                    id={project.id}
                                    title={project.title}
                                    shortDescription={project.description}
                                    imageUrl={project.image_url}
                                    category={project.category}
                                    year={project.completion_year}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
