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
    <Link href={`/projects/${id}`} className="block h-full group">
      <div className="relative h-[420px] overflow-hidden rounded-xl bg-muted border border-border/50 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
        {/* Background Image - object-cover fills the card fully with no black bars */}
        <Image
          src={imageUrl || "/placeholder.svg?height=800&width=600"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Floating Category Tag */}
        {category && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}

        {/* Content Container - hidden by default, slides up on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-black/50 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-2 text-primary">
              {year && <span className="text-sm font-mono tracking-wider">{year}</span>}
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            <h3 className="text-xl font-bold font-heading leading-tight mb-3 text-primary">
              {title}
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {shortDescription}
            </p>

            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary gap-2">
              View Details <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
