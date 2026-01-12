"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Image from "next/image"

interface WhyChooseContent {
  id: string
  title: string
  description: string
}

export function WhyChooseSection() {
  const [content, setContent] = useState<WhyChooseContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data } = await supabase.from("why_choose").select("*").single()

        if (data) {
          setContent(data)
        }
      } catch (error) {
        console.error("Error fetching why choose content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const defaultContent = {
    title: "WHY CHOOSE ATCON?",
    description:
      "Atcon Engineers & Developers work as a constructing team combining architecture, value-engineering, and development expertise. Based in Islamabad, Pakistan, renowned for our commitment to excellence, we specialize in designing and delivering innovative solutions. Our team brings together diverse skill sets and experiences to create designs that not only meet but exceed client expectations. From concept to completion, we maintain the highest standards of quality and integrity. Whether you're looking for residential masterplans, commercial projects or industrial facilities, we channel your vision and ideation into meaningful designs that last.",
  }

  return (
    <section className="w-full bg-background dark:bg-neutral-900 py-20 md:py-32 relative overflow-hidden flex items-center transition-colors duration-500">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center opacity-10 dark:opacity-20 filter grayscale"
        style={{ backgroundImage: 'url("https://talatiandpartners.com/wp-content/uploads/2024/06/Fusing-Functionality-6-1.webp")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-white/30 dark:from-black dark:via-black/90 dark:to-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <div className="w-20 h-1 bg-primary mb-8" />
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground dark:text-white mb-8 leading-tight">
            {content?.title || defaultContent.title}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 leading-relaxed text-pretty font-light">
            {content?.description || defaultContent.description}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="border-l-2 border-primary pl-6">
              <h4 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-1">15+</h4>
              <p className="text-sm text-primary uppercase tracking-wider font-bold">Years Experience</p>
            </div>
            <div className="border-l-2 border-primary pl-6">
              <h4 className="text-3xl font-heading font-bold text-foreground dark:text-white mb-1">100%</h4>
              <p className="text-sm text-primary uppercase tracking-wider font-bold">Client Satisfaction</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative hidden md:block group">
          <div className="aspect-[4/3] relative rounded-sm overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 group-hover:shadow-primary/40 transition-shadow duration-500">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY_0R__yp88WaRZyuFfGSU-CoHNIIFXVNYpw&s"
              alt="Why Choose Atcon"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </section>
  )
}
