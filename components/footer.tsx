import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background dark:bg-black text-foreground dark:text-white border-t border-border/10 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 relative">
                <Image src="/logo.png" alt="Atcon Logo" fill className="object-contain" />
              </div>
            </div>
            <p className="text-muted-foreground dark:text-gray-400 leading-relaxed mb-6">
              We are a team of architects, engineers, and developers working together to create meaningful designs that last.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold text-foreground dark:text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Team', 'Projects', 'Media', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : item === 'Contact' ? '/contact' : `/${item.toLowerCase()}`} className="text-muted-foreground dark:text-gray-400 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold text-foreground dark:text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground dark:text-gray-400">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <a href="https://www.google.com/maps/dir//1st+Floor+55,+2+Jinnah+Boulevard,+E+DHA,+Islamabad,+44000/@33.6297984,73.07264,10z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x38dfed5e92cc164b:0x7f55327c5f2b5ee0!2m2!1d73.1584079!2d33.5311394?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  3rd Floor, Plaza 16, Jinnah Boulevard East, Sector A, DHA II, Islamabad.
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground dark:text-gray-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+923000171399" className="hover:text-primary transition-colors">+92 300 0171399</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground dark:text-gray-400">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:kohatian3597@gmail.com" className="hover:text-primary transition-colors">kohatian3597@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-heading font-bold text-foreground dark:text-white mb-6">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-sm bg-muted/20 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-muted-foreground dark:text-gray-400"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 ATCON Architecture. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
