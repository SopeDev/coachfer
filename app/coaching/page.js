import Navbar from "../../components/Navbar/Navbar"
import CoachingHero from "../../components/CoachingHero/CoachingHero"
import PainPoints from "../../components/PainPoints/PainPoints"
import Quote from "../../components/Quote/Quote"
import Benefits from "../../components/Benefits/Benefits"
import Metodo from "../../components/Metodo/Metodo"
import Offer from "../../components/Offer/Offer"
import FAQ from "../../components/FAQ/FAQ"
import CTA from "../../components/CTA/CTA"
import Footer from "../../components/Footer/Footer"
import FloatingWhatsApp from "../../components/FloatingWhatsApp/FloatingWhatsApp"

export const metadata = {
  title: "Coaching Privado",
  description:
    "Coaching privado de AstroHacking®: reprogramación cuántica del destino en sesiones personalizadas. Elige tu paquete e inicia tu proceso.",
  openGraph: {
    title: "Coaching Privado | AstroHacking®",
    description:
      "Sesiones individuales de reprogramación cuántica del destino. Personalizado, intensivo y orientado a tu propósito.",
  },
}

export default function CoachingPage() {
  return (
    <main>
      <Navbar />
      <CoachingHero />
      <PainPoints />
      <Quote />
      <Benefits />
      <Metodo />
      <Offer />
      <FAQ />
      <CTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
