import "../styles/globals.scss"
import { Cormorant_Garamond } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"
import GoogleAnalytics from "../components/Analytics/GoogleAnalytics"
import Providers from "../components/Providers/Providers"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata = {
  title: {
    default: "AstroHacking® — Fernando Quintero",
    template: "%s | AstroHacking®",
  },
  description:
    "AstroHacking®: reprogramación cuántica del destino. Coaching privado y Entrenamiento de la Consciencia.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({ children }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZQ9BHPKBPZ"

  return (
    <html lang="es" suppressHydrationWarning className={cormorantGaramond.variable}>
      <body suppressHydrationWarning>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

