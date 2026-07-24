"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: "new",
        },
      ])

      if (error) throw error

      setSubmitMessage({
        type: "success",
        text: "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage({
        type: "error",
        text: "There was an error sending your message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Contact Us"
        description="Let's build something extraordinary together."
        backgroundImage="/hero1.jpg"
      />

      <div className="relative bg-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent skew-y-3 origin-top-left" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left Column: Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-4xl font-bold font-heading text-foreground mb-6">Get In Touch</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether you have a specific project in mind or just want to explore possibilities,
                  our team is ready to listen and collaborate.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { icon: Mail, label: "Email Us", value: "kohatian3597@gmail.com", link: "mailto:kohatian3597@gmail.com" },
                  { icon: Phone, label: "Call Us", value: "+92 300 0171399", link: "tel:+923000171399" },
                  { icon: MapPin, label: "Visit Us", value: "3rd Floor, Plaza 16, Jinnah Boulevard East, Sector A, DHA II, Islamabad.", link: "https://www.google.com/maps/dir//1st+Floor+55,+2+Jinnah+Boulevard,+E+DHA,+Islamabad,+44000/@33.6297984,73.07264,10z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x38dfed5e92cc164b:0x7f55327c5f2b5ee0!2m2!1d73.1584079!2d33.5311394?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors text-wrap break-words">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Decorative Map Placeholder */}
              <div className="aspect-video rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative border border-border shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.056024467364!2d73.15621921162622!3d33.53114383827179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed5e92cc164b%3A0x7f55327c5f2b5ee0!2sATCON%20Engineers%20%26%20Developers!5e0!3m2!1sen!2s!4v1705353000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-70 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </motion.div>

            {/* Right Column: Floating Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative blob behind form */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] opacity-50" />

              <div className="bg-card/30 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Send Message</h3>

                {submitMessage && (
                  <div
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${submitMessage.type === "success"
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Your Phone Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                        placeholder="Project Inquiry"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-3 bg-background/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                      placeholder="Tell us about your next big idea..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-300"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
