"use client"

import Link from "next/link"

export function ContactCtaSection() {
  return (
    <section className="w-full bg-gradient-to-r from-primary to-cyan-400 py-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">READY TO START YOUR PROJECT?</h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with us to discuss your architectural vision. Let&apos;s build the future together with precision and innovation.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-primary px-10 py-4 rounded-sm font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-xl uppercase"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}
