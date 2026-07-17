"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, Calendar } from "lucide-react"

interface ShortCardProps {
    id: string
    title: string
    videoId: string
    thumbnailUrl?: string
    date?: string
    category?: string
}

export function ShortCard({ title, videoId, thumbnailUrl, date, category }: ShortCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    // image_url from DB is now always the oEmbed-verified URL.
    // Fallback to hq2.jpg which is what oEmbed returns for Shorts.
    const image = thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hq2.jpg`

    return (
        <>
            <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer aspect-[9/16]"
                onClick={() => setIsOpen(true)}
            >
                {/* Thumbnail Container */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Glowing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/70 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/50 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl group-hover:bg-primary/90 transition-colors">
                                    <Play className="w-5 h-5 ml-1 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {date && (
                            <div className="flex items-center text-xs text-gray-300 font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                <Calendar className="w-3 h-3 mr-1 text-primary" />
                                {date}
                            </div>
                        )}
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-3 drop-shadow-md">
                        {title}
                    </h3>
                </div>
            </motion.div>

            {/* Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                title={title}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
