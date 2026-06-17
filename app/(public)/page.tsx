import { Hero } from "@/components/hero"
import { IntroAnimation } from "@/components/intro-animation"
import { ServicesSection } from "@/components/services-section"
import { ProjectsHomeSection } from "@/components/projects-home-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { ClientsSection } from "@/components/clients-section"
import { ContactCtaSection } from "@/components/contact-cta-section"
import { GoogleReviews } from "@/components/google-reviews"

export default function Home() {
    return (
        <>
            <IntroAnimation />
            <Hero />
            <ServicesSection />
            <ProjectsHomeSection />
            <WhyChooseSection />
            <ClientsSection />
            <GoogleReviews />
            <ContactCtaSection />
        </>
    )
}
