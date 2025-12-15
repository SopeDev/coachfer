"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { pageview } from "../../lib/analytics"

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views on route change
    // GA4 is already initialized via Script tags in layout.js
    if (pathname && typeof window !== "undefined" && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

