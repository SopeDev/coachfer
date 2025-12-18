import Navbar from "../../components/Navbar/Navbar"
import Agendar from "../../components/Agendar/Agendar"
import Footer from "../../components/Footer/Footer"

export const metadata = {
  title: "Reserva tu Sesión - Fernando Quintero",
  description: "Agenda tu sesión de reprogramación cuántica del destino. Elige la fecha y hora que mejor se adapte a tu agenda.",
}

export default function AgendarPage() {
  return (
    <main>
      <Navbar />
      <Agendar />
      <Footer />
    </main>
  )
}





