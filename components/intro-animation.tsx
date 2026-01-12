"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function IntroAnimation() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Strictly adhere to user's 7 second request
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 7000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <div className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-64 h-64 md:w-96 md:h-96 drop-shadow-2xl"
                        >
                            <defs>
                                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" />
                                    <stop offset="50%" stopColor="#d4af37" />
                                    <stop offset="100%" stopColor="var(--primary)" />
                                </linearGradient>
                            </defs>

                            {/* Crane / Construction Structure - Draws first */}
                            <motion.path
                                d="M170 160 L170 20 L200 20 M170 40 L120 10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="text-foreground/30"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />

                            {/* Main Building Outline - Draws second */}
                            <motion.path
                                d="M40 160 L40 60 L100 20 L160 60 L160 160 H40Z"
                                stroke="var(--primary)"
                                strokeWidth="3"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, fill: "transparent" }}
                                animate={{
                                    pathLength: 1,
                                    fill: "rgba(var(--primary), 0.1)" // Subtle fill
                                }}
                                transition={{
                                    pathLength: { duration: 3, delay: 0.5, ease: "easeInOut" },
                                    fill: { duration: 1, delay: 3.5 }
                                }}
                            />

                            {/* Inner details / windows - Draws third */}
                            <motion.path
                                d="M60 160 V75 M80 160 V75 M100 160 V75 M120 160 V75 M140 160 V75"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-primary/40"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, delay: 2.5, ease: "easeOut" }}
                            />

                            {/* "Paint" Effect - Fills the building with gradient/solid color from bottom up */}
                            <motion.path
                                d="M45 155 L45 65 L100 28 L155 65 L155 155 H45Z"
                                fill="var(--primary)"
                                initial={{ scaleY: 0, transformOrigin: "bottom" }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 1.5, delay: 4, ease: "circOut" }}
                                className="opacity-20"
                            />
                        </svg>

                        {/* Typography Reveal */}
                        <div className="absolute -bottom-8 md:-bottom-12 text-center overflow-hidden">
                            <motion.h1
                                className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tighter"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 4.5, ease: "backOut" }}
                            >
                                ATCON
                            </motion.h1>
                            <motion.div
                                className="w-full h-1 bg-primary mt-1"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 5 }}
                            />
                            <motion.p
                                className="text-sm md:text-base text-muted-foreground tracking-[0.3em] mt-2 font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 5.5 }}
                            >
                                ENGINEERS & DEVELOPERS
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
