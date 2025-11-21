import "../styles/globals.scss"
import { Cormorant_Garamond } from "next/font/google"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata = {
  title: "Fernando Quintero - Astrología Cuántica Kabbalista",
  description: "Reprogramación Cuántica del Destino - Un proceso de 3 sesiones para reconectarte con tu propósito más elevado",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={cormorantGaramond.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

