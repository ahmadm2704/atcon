"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
    title: string
    description?: string
    backgroundImage?: string
}


export function PageHeader({ title, description, backgroundImage }: PageHeaderProps) {
    return (
        <section className="relative w-full pt-28 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-background">
            {/* Background with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent z-0" />
                {backgroundImage && (
                    <div
                        className="absolute inset-0 opacity-20 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100px" }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-1 bg-gradient-to-r from-primary to-transparent mb-6"
                    />
                    <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-4 md:mb-6 tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
