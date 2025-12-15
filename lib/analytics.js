// Google Analytics 4 utility functions

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

// Initialize GA4
export const initGA = () => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) {
    return
  }

  // Load gtag script
  const script1 = document.createElement("script")
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag("js", new Date())
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// Track page view
export const pageview = (url) => {
  if (typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Track custom events
export const event = ({ action, category, label, value }) => {
  if (typeof window === "undefined" || !window.gtag) {
    return
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Track Calendly events
export const trackCalendlyEvent = (eventName, details = {}) => {
  event({
    action: eventName,
    category: "Calendly",
    label: details.eventType || "Scheduling",
    value: details.value,
  })
}



