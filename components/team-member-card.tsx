import Image from "next/image"
import { Mail, Phone, Linkedin } from "lucide-react"

interface TeamMemberCardProps {
  id: string
  name: string
  position: string
  bio?: string
  imageUrl?: string
  email?: string
  phone?: string
  socialLinks?: Record<string, string>
}

export function TeamMemberCard({ id, name, position, bio, imageUrl, email, phone, socialLinks }: TeamMemberCardProps) {
  return (
    <div className="group">
      {/* Image */}
      <div className="relative w-full h-72 overflow-hidden rounded-lg bg-muted mb-4">
        <Image
          src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=400`}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-primary font-semibold mb-3">{position}</p>
        {bio && <p className="text-foreground/70 text-sm mb-4">{bio}</p>}

        {/* Contact Links */}
        <div className="flex items-center gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              title={email}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              title={phone}
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
