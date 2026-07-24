"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function IntroAnimation() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Reduce time since animation is simpler now
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 3000)

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
                    <div className="relative w-full max-w-5xl aspect-square flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-[80vw] h-[25vw] max-w-3xl max-h-64 mb-8"
                        >
                            <Image
                                src="/logo.png"
                                alt="ATCON Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Animated Underline */}
                        <motion.div
                            className="w-full max-w-[200px] h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                        />

                        {/* Glowing effect behind */}
                        <motion.div
                            className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-[-1]"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, delay: 0.5 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
