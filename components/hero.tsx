"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  // Track active slide
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 7000)

    return () => {
      clearInterval(autoplay)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  const [slides, setSlides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data, error } = await supabase
          .from("hero_slides")
          .select("*")
          .order("order_index", { ascending: true })

        if (error) throw error
        setSlides(data || [])
      } catch (error) {
        console.error("Error fetching hero slides:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  const defaultSlides = [
    {
      id: "default-1",
      image_url: "/hero1.jpg",
      title1: "WELCOME TO",
      title2: "ATCON",
      description: "Please configure hero slides in the admin panel."
    }
  ]

  const displaySlides = slides.length > 0 ? slides : defaultSlides

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Slides */}
      <div className="absolute inset-0 z-0" ref={emblaRef}>
        <div className="flex h-full">
          {displaySlides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image
                src={slide.image_url || "/placeholder.svg"}
                alt={slide.title1 + " " + slide.title2}
                fill
                className="object-cover opacity-90"
                priority
              />
              {/* Gradients for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Bar - Positioned in Middle-Center (Absolute) like the reference */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-20 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex items-center gap-2 shadow-2xl">
            <div className="flex bg-transparent border-r border-white/20 h-12 items-center px-4 w-1/4">
              <Select>
                <SelectTrigger className="bg-transparent border-none text-white focus:ring-0 text-base font-medium h-full p-0">
                  <SelectValue placeholder="Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Recent Projects</SelectItem>
                  <SelectItem value="completed">Past Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex bg-transparent border-r border-white/20 h-12 items-center px-4 w-1/4">
              <Select>
                <SelectTrigger className="bg-transparent border-none text-white focus:ring-0 text-base font-medium h-full p-0">
                  <SelectValue placeholder="Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 px-4">
              <Input
                type="text"
                placeholder="Start typing here..."
                className="bg-transparent border-none text-white placeholder:text-white/70 focus-visible:ring-0 h-12 text-base p-0"
              />
            </div>
            <Button className="h-12 px-8 bg-transparent hover:bg-white/10 text-white border-l border-white/20 rounded-none font-bold uppercase tracking-wider">
              Search
            </Button>
          </div>
        </div>


        {/* Dynamic Text Block - Strictly Bottom Left Corner & Small */}
        {displaySlides.length > 0 && displaySlides[activeIndex] && (
          <div className="absolute bottom-12 left-8 md:left-12 max-w-2xl" key={activeIndex}>
            {/* Animated Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tighter uppercase font-heading select-none animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-[var(--primary)] mr-3 drop-shadow-lg inline-block">{displaySlides[activeIndex].title1}</span>
              <span className="text-white drop-shadow-lg inline-block">{displaySlides[activeIndex].title2}</span>
            </h1>

            {/* Animated Description */}
            <p
              className="text-base md:text-lg text-white/90 font-light leading-relaxed mt-4 max-w-xl drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
            >
              {displaySlides[activeIndex].description}
            </p>
          </div>
        )}

        {/* Carousel Dots - Bottom Right */}
        <div className="absolute right-8 bottom-12 flex gap-3 z-30">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 border border-white ${index === activeIndex ? "bg-[var(--primary)] border-[var(--primary)] scale-125" : "bg-transparent hover:bg-white/30"}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
