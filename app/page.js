import Navbar from "../components/Navbar/Navbar"
import Hero from "../components/Hero/Hero"
import MetricsBanner from "../components/MetricsBanner/MetricsBanner"
import Testimonials from "../components/Testimonials/Testimonials"
import PainPoints from "../components/PainPoints/PainPoints"
import Quote from "../components/Quote/Quote"
import Benefits from "../components/Benefits/Benefits"
import Metodo from "../components/Metodo/Metodo"
import SobreFernando from "../components/SobreFernando/SobreFernando"
import Offer from "../components/Offer/Offer"
import CTA from "../components/CTA/CTA"
import Footer from "../components/Footer/Footer"
import FloatingWhatsApp from "../components/FloatingWhatsApp/FloatingWhatsApp"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MetricsBanner />
      <Testimonials />
      <PainPoints />
      {/* <Quote /> */}
      <Benefits />
      <Metodo />
      <SobreFernando />
      <Offer />
      <CTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}


