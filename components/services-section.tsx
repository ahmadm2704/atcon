"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Building2, Pencil, Leaf, Home, Construction, Ruler } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  icon_url?: string
  order_index: number
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("services").select("*").order("order_index", { ascending: true })

        if (error) throw error
        setServices(data || [])
      } catch (error) {
        console.error("Error fetching services:", error)
        // Fallback to default services to match the reference quantity/style
        setServices([
          {
            id: "1",
            title: "RESIDENTIAL ARCHITECTURE",
            description: "",
            order_index: 0,
          },
          {
            id: "2",
            title: "COMMERCIAL ARCHITECTURE",
            description: "",
            order_index: 1,
          },
          {
            id: "3",
            title: "CONSTRUCTION",
            description: "",
            order_index: 2,
          },
          {
            id: "4",
            title: "DESIGNER COMMERCIAL PROJECT",
            description: "",
            order_index: 3,
          },
          {
            id: "5",
            title: "DESIGNER VILLAS",
            description: "",
            order_index: 4,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const iconMap = [Home, Building2, Construction, Building2, Home, Ruler]

  return (
    <section className="py-24 bg-background dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background pattern - Theme aware */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
          color: 'var(--foreground)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header - Matching Reference "OUR SERVICES" with line-square-line */}
        <div className="text-center mb-20 relative">
          <h2 className="text-4xl md:text-5xl font-black font-heading text-foreground uppercase tracking-tight mb-4 drop-shadow-xl dark:drop-shadow-none">
            OUR SERVICES
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[2px] w-16 bg-[var(--primary)] rounded-full"></div>
            <div className="w-3 h-3 border-2 border-[var(--primary)] bg-background dark:bg-black rotate-45"></div>
            <div className="h-[2px] w-16 bg-[var(--primary)] rounded-full"></div>
          </div>
        </div>

        {/* Circular Grid Layout */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 max-w-6xl mx-auto">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-32 h-32 rounded-full bg-muted" />
                <div className="w-40 h-4 bg-muted rounded" />
              </div>
            ))
          ) : (
            services.map((service, idx) => {
              const Icon = iconMap[idx % iconMap.length]
              return (
                <div key={service.id} className="flex flex-col items-center group w-[220px]">
                  {/* Circular Icon Container */}
                  <div className="w-36 h-36 rounded-full bg-white dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 border border-border dark:border-white/10 shadow-lg dark:shadow-2xl flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:border-[var(--primary)]/50">
                    {/* Inner glow ring */}
                    <div className="absolute inset-2 rounded-full border border-black/5 dark:border-white/5 group-hover:border-[var(--primary)]/20 transition-colors duration-500"></div>

                    <Icon strokeWidth={1.5} className="w-14 h-14 text-[var(--primary)] drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold font-heading text-foreground text-center uppercase tracking-widest px-2 group-hover:text-[var(--primary)] transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
