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
      <div className="relative h-[450px] overflow-hidden rounded-xl bg-muted border border-border/50 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
        {/* Background Image */}
        <Image
          src={imageUrl || "/placeholder.svg?height=800&width=600"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Floating Category Tag */}
        {category && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}

        {/* Content Container - Slide Up Effect */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl group-hover:bg-black/50 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-3 text-primary/80 group-hover:text-primary transition-colors">
              {year && <span className="text-sm font-mono tracking-wider">{year}</span>}
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            <h3 className="text-2xl font-bold font-heading leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
              <div className="overflow-hidden">
                <p className="text-gray-300 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {shortDescription}
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary gap-2">
                  View Details <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
