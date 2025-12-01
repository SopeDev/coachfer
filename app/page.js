import Navbar from "../components/Navbar/Navbar"
import Hero from "../components/Hero/Hero"
import PainPoints from "../components/PainPoints/PainPoints"
import Quote from "../components/Quote/Quote"
import SobreFernando from "../components/SobreFernando/SobreFernando"
import Metodo from "../components/Metodo/Metodo"
import Benefits from "../components/Benefits/Benefits"
import Testimonials from "../components/Testimonials/Testimonials"
import Offer from "../components/Offer/Offer"
import CTA from "../components/CTA/CTA"
import Footer from "../components/Footer/Footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <Quote />
      <SobreFernando />
      <Metodo />
      <Benefits />
      <Testimonials />
      <Offer />
      <CTA />
      <Footer />
    </main>
  )
}


