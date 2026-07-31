import Navbar from "../../components/Navbar/Navbar"
import MastermindHero from "../../components/Mastermind/MastermindHero/MastermindHero"
import MastermindIntro from "../../components/Mastermind/MastermindIntro/MastermindIntro"
import SessionAgenda from "../../components/Mastermind/SessionAgenda/SessionAgenda"
import IdealFor from "../../components/Mastermind/IdealFor/IdealFor"
import Modality from "../../components/Mastermind/Modality/Modality"
import MastermindPackages from "../../components/Mastermind/MastermindPackages/MastermindPackages"
import MastermindFAQ from "../../components/Mastermind/MastermindFAQ/MastermindFAQ"
import MastermindCTA from "../../components/Mastermind/MastermindCTA/MastermindCTA"
import Footer from "../../components/Footer/Footer"
import FloatingWhatsApp from "../../components/FloatingWhatsApp/FloatingWhatsApp"

export const metadata = {
  title: "Entrenamiento de la Consciencia",
  description:
    "Laboratorio semanal en vivo para elevar, expandir y reprogramar la consciencia. AstroHacking® — entrenamiento colectivo con créditos de sesión.",
  openGraph: {
    title: "Entrenamiento de la Consciencia | AstroHacking®",
    description:
      "No basta con despertar… hay que entrenar la consciencia todos los días. Laboratorio semanal de astrología aplicada y reprogramación.",
  },
}

export default function MastermindPage() {
  return (
    <main>
      <Navbar />
      <MastermindHero />
      <MastermindIntro />
      <SessionAgenda />
      <IdealFor />
      <Modality />
      <MastermindPackages />
      <MastermindFAQ />
      <MastermindCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
