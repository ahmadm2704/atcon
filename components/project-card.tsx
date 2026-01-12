import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProjectCardProps {
  id: string
  title: string
  shortDescription: string
  imageUrl: string
  year?: number
  category?: string
}

export function ProjectCard({ id, title, shortDescription, imageUrl, year, category }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`} className="block h-full">
      <div className="group relative bg-card/60 backdrop-blur-md border border-white/5 rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-700 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/10">
        {/* Image */}
        <div className="relative w-full h-72 overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg?height=400&width=600&query=architecture project"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {category && (
            <div className="absolute top-4 left-4">
              <span className="text-xs font-bold font-heading tracking-widest text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-sm border border-white/10 uppercase">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col relative bg-card/40 backdrop-blur-md group-hover:bg-card/80 transition-all duration-500">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-0.5 bg-primary mb-4 transition-all duration-300 group-hover:w-16" />
            {year && <span className="text-xs font-mono text-gray-500">{year}</span>}
          </div>

          <h3 className="text-xl font-heading font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed font-sans">{shortDescription}</p>

          <div className="flex items-center text-primary font-bold text-xs tracking-widest uppercase gap-2 group-hover:gap-3 transition-all">
            View Project <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}
