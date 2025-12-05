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
  description: "AstroHacking: Reprogramación del Software Astrológico - Un método de reprogramación cuántica para reconectarte con tu propósito más elevado",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={cormorantGaramond.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

