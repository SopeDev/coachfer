import Navbar from "../components/Navbar/Navbar"
import Hero from "../components/Hero/Hero"
import Metodo from "../components/Metodo/Metodo"
import ProductOfferings from "../components/ProductOfferings/ProductOfferings"
import MetricsBanner from "../components/MetricsBanner/MetricsBanner"
import Testimonials from "../components/Testimonials/Testimonials"
import SobreFernando from "../components/SobreFernando/SobreFernando"
import HomeCTA from "../components/HomeCTA/HomeCTA"
import Footer from "../components/Footer/Footer"
import FloatingWhatsApp from "../components/FloatingWhatsApp/FloatingWhatsApp"

export const metadata = {
  title: {
    absolute: "AstroHacking® — Fernando Quintero",
  },
  description:
    "AstroHacking®: reprogramación cuántica del destino. Coaching privado y Entrenamiento de la Consciencia — dos caminos para elevar tu propósito.",
  openGraph: {
    title: "AstroHacking® — Fernando Quintero",
    description:
      "Coaching privado y entrenamiento colectivo de la consciencia. Astrología kabbalista y reprogramación cuántica.",
  },
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero
        primaryCtaLabel="Coaching Personal"
        primaryCtaHref="/coaching"
        secondaryCtaLabel="Entrenamiento Semanal"
        secondaryCtaHref="/mastermind"
      />
      <ProductOfferings />
      <SobreFernando />
      <MetricsBanner tone="soft" />
      <Testimonials tone="white" />
      <Metodo sectionLabel="Nuestro método:" compact tone="soft" />
      <HomeCTA tone="white" />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
