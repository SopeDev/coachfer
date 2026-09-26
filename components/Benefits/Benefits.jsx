"use client"

import { Fragment, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Benefits.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Benefits() {
  const sectionRef = useRef(null)
  const columnsRef = useRef([])
  const connectorsRef = useRef([])

  const panels = [
    {
      phase: "01",
      eyebrow: "Viendo lo Invisible",
      text: "Muchos de tus patrones no son tuyos. Son lealtades heredadas. Tu carta natal revela dónde se grabaron esos contratos y cómo liberarte de ellos."
    },
    {
      phase: "02",
      eyebrow: "Sanando lo Heredado",
      text: "Las heridas de la infancia, la memoria celular y el dolor emocional heredado se transmutan y dejan de gobernar tu vida cuando son vistos con conciencia."
    },
    {
      phase: "03",
      eyebrow: "Activando Tu Diseño Original",
      text: "Tu poder personal se restaura, haciendo que los mismos patrones que te limitaban se transformen en impulso para tu ascensión, al anclar la frecuencia de tu ser superior."
    }
  ]

  useGSAP(() => {
    const cards = columnsRef.current.filter(Boolean)
    const connectors = connectorsRef.current.filter(Boolean)
    if (!cards.length) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 769px)", () => {
      // Desktop/tablet: pin the whole section (title included) and scrub
      // each phase's fade-in as the user scrolls — no vertical movement,
      // just opacity. Each connector arrow fades in together with the
      // card that follows it. Once phase 3 finishes fading in, the pin
      // releases and normal page scroll continues.
      gsap.set([...cards, ...connectors], { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.75}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      })

      cards.forEach((card, index) => {
        // Card 0 fades in alone; every card after it fades in together
        // with the connector arrow that precedes it.
        const targets = index === 0 ? card : [connectors[index - 1], card]
        tl.to(targets, { opacity: 1, duration: 1, ease: "none" }, index)
      })

      return () => {
        gsap.set([...cards, ...connectors], { clearProps: "opacity" })
      }
    })

    mm.add("(max-width: 768px)", () => {
      // Mobile: cards are already stacked, so each one just fades in
      // independently as it scrolls into view — no pin needed.
      gsap.set(cards, { opacity: 0 })

      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        })
      })

      return () => {
        gsap.set(cards, { clearProps: "opacity" })
      }
    })

    // The pin distance is measured from the section's rendered height. If the
    // custom font swaps in after that first measurement, the section can
    // resize and leave the pin spacer stale — recalculating once fonts are
    // ready keeps #benefits and #metodo from overlapping.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section id="benefits" ref={sectionRef} className="benefits">
      <div className="benefits__header">
        <h2 className="benefits__title">Cómo funciona el proceso</h2>
        <p className="benefits__subtitle">Tres fases de transformación</p>
      </div>

      <div className="benefits__columns-wrapper">
        {panels.map((panel, index) => (
          <Fragment key={index}>
            <div
              ref={(el) => (columnsRef.current[index] = el)}
              className="benefits__column"
            >
              <div className="benefits__column-icon">
                {index === 0 && (
                  // Simplified birth chart - circle divided into 12 sections
                  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="benefits__column-icon-svg">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" fill="none"/>
                    {/* 12 house divisions */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 - 90) * (Math.PI / 180)
                      const x1 = 60 + 30 * Math.cos(angle)
                      const y1 = 60 + 30 * Math.sin(angle)
                      const x2 = 60 + 55 * Math.cos(angle)
                      const y2 = 60 + 55 * Math.sin(angle)
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1"/>
                      )
                    })}
                  </svg>
                )}
                {index === 1 && (
                  // Healing symbol - broken DNA/chain
                  <svg viewBox="0 0 339.33 343.33" xmlns="http://www.w3.org/2000/svg" className="benefits__column-icon-svg benefits__column-icon-svg--small">
                    <rect x="164.11" y="38.35" width="180.5" height="94.9" rx="45.59" ry="45.59" transform="translate(13.83 204.99) rotate(-45)" fill="none" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <rect x="-7.6" y="210.06" width="180.5" height="94.9" rx="45.59" ry="45.59" transform="translate(-157.88 133.86) rotate(-45)" fill="none" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <line x1="99.75" y1="241.06" x2="237.91" y2="104.22" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <line x1="74" y1="124.63" x2="111.67" y2="136.33" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <line x1="226.32" y1="209.59" x2="263.79" y2="221.89" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <line x1="204.64" y1="230.43" x2="218.71" y2="267.28" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                    <line x1="119.07" y1="79.95" x2="133.14" y2="116.8" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                  </svg>
                )}
                {index === 2 && (
                  // Activation symbol - radiating energy/light rays
                  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="benefits__column-icon-svg benefits__column-icon-svg--large">
                    {/* Central circle */}
                    <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="60" cy="60" r="8" fill="currentColor"/>
                    {/* Radiating rays */}
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45 - 90) * (Math.PI / 180)
                      const x1 = 60 + 20 * Math.cos(angle)
                      const y1 = 60 + 20 * Math.sin(angle)
                      const x2 = 60 + 35 * Math.cos(angle)
                      const y2 = 60 + 35 * Math.sin(angle)
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      )
                    })}
                  </svg>
                )}
              </div>

              <span className="benefits__column-phase">Fase {panel.phase}</span>
              <span className="benefits__column-eyebrow">{panel.eyebrow}</span>
              <p className="benefits__column-paragraph">{panel.text}</p>
            </div>

            {index < panels.length - 1 && (
              <div
                ref={(el) => (connectorsRef.current[index] = el)}
                className="benefits__connector"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
