"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Benefits.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Benefits() {
  const sectionRef = useRef(null)
  const columnsWrapperRef = useRef(null)
  const columnsRef = useRef([])

  const panels = [
    {
      type: 'content',
      backgroundImage: '/images/panel-1.png',
      phase: '01',
      eyebrow: 'Viendo lo Invisible',
      text: 'Muchos de tus patrones no son tuyos. Son lealtades heredadas. Tu carta natal revela dónde se grabaron esos contratos y cómo liberarte de ellos.'
    },
    {
      type: 'content',
      backgroundImage: '/images/panel-2.png',
      phase: '02',
      eyebrow: 'Sanando lo Heredado',
      text: 'Las heridas de la infancia, la memoria celular y el dolor emocional heredado se transmutan y dejan de gobernar tu vida cuando son vistos con conciencia.'
    },
    {
      type: 'content',
      backgroundImage: '/images/panel-3.png',
      phase: '03',
      eyebrow: 'Activando Tu Diseño Original',
      text: 'Tu poder personal se restaura, haciendo que los mismos patrones que te limitaban se transformen en impulso para tu ascensión, al anclar la frecuencia de tu ser superior.'
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !columnsWrapperRef.current) return

    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        if (!columnsWrapperRef.current || columnsRef.current.length !== 3) return

        const [col1, col2, col3] = columnsRef.current
        const viewportHeight = window.innerHeight

        // Set initial states - columns 2 and 3 start below viewport
        gsap.set([col2, col3], { y: viewportHeight })

        // Create timeline for sequential column reveal
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${viewportHeight * 2}`, // Exactly 2 viewport heights for 2 columns to scroll up
            pin: columnsWrapperRef.current,
            pinSpacing: true,
            anticipatePin: true,
            scrub: true,
            invalidateOnRefresh: true
          }
        })

        // Column 2 scrolls up (0% to 50% of scroll)
        tl.to(col2, {
          y: 0,
          duration: 1,
          ease: "none"
        }, 0)

        // Column 3 scrolls up (50% to 100% of scroll)
        tl.to(col3, {
          y: 0,
          duration: 1,
          ease: "none"
        }, 1)
      },

      "(max-width: 768px)": () => {
        // Mobile: no animations, just stack vertically
        columnsRef.current.forEach((col) => {
          gsap.set(col, { y: 0 })
        })
      }
    })
  }, { scope: sectionRef })

  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener("load", handleLoad)
    return () => window.removeEventListener("load", handleLoad)
  }, [])

  return (
    <section id="benefits" ref={sectionRef} className="benefits">
      <div className="benefits__header">
        <h2 className="benefits__title">Cómo funciona el proceso</h2>
        <p className="benefits__subtitle">Tres fases de transformación</p>
      </div>
      <div ref={columnsWrapperRef} className="benefits__columns-wrapper">
        {panels.map((panel, index) => (
          <div
            key={index}
            ref={el => columnsRef.current[index] = el}
            className={`benefits__column benefits__column--${panel.type}`}
          >
            <div
              className="benefits__column-bg"
              style={{
                backgroundImage: panel.backgroundImage ? `url(${panel.backgroundImage})` : 'none'
              }}
            >
              <div className="benefits__column-content">
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
                {panel.phase && (
                  <span className="benefits__column-phase">Fase {panel.phase}</span>
                )}
                {panel.eyebrow && (
                  <span className="benefits__column-eyebrow">{panel.eyebrow}</span>
                )}
                {panel.text && (
                  <p className="benefits__column-paragraph">{panel.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
