"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Quote from "../Quote/Quote"
import "./Benefits.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Benefits() {
  const sectionRef = useRef(null)
  const horizontalWrapperRef = useRef(null)
  const horizontalContainerRef = useRef(null)
  const panelsRef = useRef([])
  const horizontalScrollRef = useRef(null)
  const [containerAnimation, setContainerAnimation] = useState(null)

  // Full-width panels with background images and centered text overlays
  const panels = [
    {
      type: "quote"
    },
    {
      type: "content",
      backgroundImage: "/images/panel-1.png",
      eyebrow: "Viendo lo Invisible",
      // text: "Cuando comprendes que estas lealtades no son tuyas, que estos patrones fueron heredados, comienzas a liberarte. Tu carta natal revela exactamente dónde están escritos estos contratos y cómo disolverlos."
      text: "Muchos de tus patrones no son tuyos. Son lealtades heredadas. Tu carta natal revela dónde se grabaron esos contratos y cómo liberarte de ellos."
    },
    {
      type: "content",
      backgroundImage: "/images/panel-2.png",
      eyebrow: "Sanando lo Heredado",
      // text: "Las heridas de infancia, las memorias celulares, el dolor acumulado en tu cuerpo emocional—todo encuentra su lugar cuando lo integras conscientemente. Aprendes a sentir sin colapsar. El karma ancestral se transmuta en sabiduría que te libera."
      text: "Las heridas de la infancia, la memoria celular y el dolor emocional heredado se transmutan y dejan de gobernar tu vida cuando son vistos con conciencia."
    },
    {
      type: "content",
      backgroundImage: "/images/panel-3.png",
      eyebrow: "Activando Tu Diseño Original",
      // text: "Tu mente reactiva se convierte en mente consciente. Tu poder personal se restaura. Los mismos patrones que te limitaban se transforman en pilares de tu ascensión. Por primera vez, operas desde tu frecuencia original—tu verdadero diseño, finalmente libre."
      text: "Tu poder personal se restaura, haciendo que los mismos patrones que te limitaban se transformen en tus pilares de ascención, al anclar la frecuencia de tu ser superior."
    },
    {
      type: "transition",
      text: "Esta transformación no es teoría. Es el resultado que cientos de personas ya experimentaron el proceso..."
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !horizontalWrapperRef.current) return


    // ===== DESKTOP: HORIZONTAL SCROLL ANIMATION (PINNED, NO SNAPPING) =====
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        if (!horizontalContainerRef.current || !horizontalWrapperRef.current) return

        // Ensure GSAP plugins are registered
        gsap.registerPlugin(ScrollTrigger)

        // Target panels using gsap.utils.toArray (following guide pattern)
        const panels = gsap.utils.toArray(".benefits__panel")

        // Calculate scroll distance: (panels.length - 1) * viewport width
        // This ensures we scroll exactly enough to show all panels, stopping at the last one
        // panels.length includes all panels (quote + content + transition)
        const scrollDistance = (panels.length - 1) * window.innerWidth

        // Create the horizontal scrolling animation (following guide pattern exactly)
        horizontalScrollRef.current = gsap.to(horizontalContainerRef.current, {
          x: -scrollDistance, // Move exactly (panels.length - 1) viewport widths
          ease: "none",
          force3D: true, // Force hardware acceleration
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            pin: true,
            anticipatePin: true,
            scrub: true, // Smooth scrubbing (following guide)
            start: "top top",
            end: () => `+=${scrollDistance}`, // Scroll exactly the calculated distance
            invalidateOnRefresh: true // Recalculate on resize
          }
        })

        // Update containerAnimation state so Quote component can use it
        setContainerAnimation(horizontalScrollRef.current)

        // Fade in/out animations for content panels as they enter/leave viewport
        panelsRef.current.forEach((panel, index) => {
          if (!panel || index === 0) return // Skip quote panel (index 0)
          
          // Skip transition panel (last panel) - it doesn't need fade animation
          if (index === panelsRef.current.length - 1) return

          const content = panel.querySelector(".benefits__panel-content")
          if (!content) return

          // Set initial state
          gsap.set(content, {
            opacity: 0
          })

          // Use ScrollTrigger with onUpdate to control opacity based on scroll progress
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: horizontalScrollRef.current,
            start: "center 100%", // Panel enters from right
            end: "center 0%", // Panel exits to left
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress // 0 to 1
              let opacity = 0

              // Fade in: 0% to 30% of scroll progress
              if (progress <= 0.3) {
                opacity = progress / 0.3 // 0 to 1
              }
              // Stay visible: 30% to 70% of scroll progress
              else if (progress <= 0.7) {
                opacity = 1
              }
              // Fade out: 70% to 100% of scroll progress
              else {
                opacity = 1 - ((progress - 0.7) / 0.3) // 1 to 0
              }

              gsap.set(content, { opacity: opacity })
            }
          })
        })
      },

      // ===== MOBILE: VERTICAL SCROLL ANIMATIONS =====
      "(max-width: 768px)": () => {
        // No animations on mobile for better performance
      }
    })
  }, { scope: sectionRef })

  // Refresh ScrollTrigger after images load
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("load", handleLoad)
    return () => window.removeEventListener("load", handleLoad)
  }, [])

  return (
    <section id="benefits" ref={sectionRef} className="benefits">
      {/* Horizontal Scroll Container */}
      <div ref={horizontalWrapperRef} className="benefits__horizontal-wrapper">
        <div ref={horizontalContainerRef} className="benefits__horizontal-container">
          {panels.map((panel, index) => (
            <div
              key={index}
              ref={el => panelsRef.current[index] = el}
              className={`benefits__panel benefits__panel--${panel.type}`}
              data-panel={index + 1}
            >
              {panel.type === "quote" ? (
                <Quote 
                  containerAnimation={containerAnimation}
                  className="benefits__quote-panel"
                />
              ) : panel.type === "transition" ? (
                <div className="benefits__panel-transition">
                  <p className="benefits__panel-transition-text">{panel.text}</p>
                </div>
              ) : (
                <div 
                  className="benefits__panel-bg"
                  style={{
                    backgroundImage: panel.backgroundImage ? `url(${panel.backgroundImage})` : 'none'
                  }}
                >
                  <div className="benefits__panel-content">
                    {panel.eyebrow && (
                      <span className="benefits__panel-eyebrow">{panel.eyebrow}</span>
                    )}
                    {panel.text && (
                      <p className="benefits__panel-paragraph">{panel.text}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
