"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./SobreFernando.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function SobreFernando() {
  const sectionRef = useRef(null)
  const img2Ref = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const textsRef = useRef(null)
  const textsInnerRef = useRef(null)

  // Calculate and set sticky top position to center texts-inner in viewport
  const calculateStickyTop = () => {
    if (!textsRef.current || !textsInnerRef.current) return

    const navbar = document.querySelector('.navbar')
    const navbarHeight = navbar ? navbar.offsetHeight : 0
    const viewportHeight = window.innerHeight
    const textsInnerHeight = textsInnerRef.current.offsetHeight

    // Center texts-inner in viewport: top + (textsInnerHeight / 2) = (viewportHeight / 2) + (navbarHeight / 2)
    // Therefore: top = (viewportHeight / 2) + (navbarHeight / 2) - (textsInnerHeight / 2)
    const top = (viewportHeight / 2) + (navbarHeight / 2) - (textsInnerHeight / 2)
    
    textsRef.current.style.top = `${top}px`
  }

  useGSAP(() => {
    const img2 = img2Ref.current
    const t1 = text1Ref.current
    const t2 = text2Ref.current
    if (!img2 || !t1 || !t2) return

    // Wait for fonts and images to load before calculating
    const calculateAfterLoad = () => {
      calculateStickyTop()
    }
    
    // Calculate immediately
    calculateStickyTop()
    
    // Also calculate after fonts load (for accurate measurements)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Wait a bit for images to render
        setTimeout(calculateAfterLoad, 100)
      })
    }

    // Recalculate on resize
    const handleResize = () => {
      calculateStickyTop()
    }
    window.addEventListener('resize', handleResize)

    // When 2nd image hits center, fade text 1 -> text 2
    ScrollTrigger.create({
      trigger: img2,
      start: "top 60%",
      onEnter: () => {
        gsap.to(t1, { opacity: 0, duration: 0.3 })
        gsap.to(t2, { opacity: 1, duration: 0.3 })
      },
      onLeaveBack: () => {
        gsap.to(t1, { opacity: 1, duration: 0.3 })
        gsap.to(t2, { opacity: 0, duration: 0.3 })
      }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, { scope: sectionRef })

  return (
    <section id="sobre" className="sobre-fernando" ref={sectionRef}>
      <div className="sobre-fernando__container">
        <div className="sobre-fernando__cta">
          <p className="sobre-fernando__cta-text">Conoce al creador del método</p>
          <div className="sobre-fernando__scroll-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="sobre-fernando__content">
          {/* LEFT COLUMN: two images stacked */}
          <div className="sobre-fernando__images">
            <div className="sobre-fernando__image-wrapper">
              <img
                src="/images/about.jpg"
                alt="Fernando Quintero"
                className="sobre-fernando__image"
              />
            </div>

            <div className="sobre-fernando__image-wrapper" ref={img2Ref}>
              <img
                src="/images/about-group.jpg"
                alt="Fernando Quintero con grupo"
                className="sobre-fernando__image"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: sticky text "slides" */}
          <div className="sobre-fernando__texts" ref={textsRef}>
            <div className="sobre-fernando__texts-inner" ref={textsInnerRef}>
              <div
                className="sobre-fernando__text sobre-fernando__text--primary"
                ref={text1Ref}
              >
                <p className="sobre-fernando__paragraph">
                  Mi enfoque ha evolucionado desde lecturas astrológicas tradicionales hacia un <strong> método profundo de reprogramación cuántica</strong>. Diseñado para quienes están listos para <strong>liberar sus limitaciones kármicas 
                  y activar su máximo potencial</strong>, mi método integra:
                </p>
                <ul className="sobre-fernando__features">
                  <li>✓ La sabiduría ancestral de la Kabbalah</li>
                  <li>✓ Principios de física cuántica</li>
                  <li>✓ Reprogramación de memorias kármicas</li>
                  <li>✓ Activación del ADN divino</li>
                </ul>
              </div>

              <div
                className="sobre-fernando__text sobre-fernando__text--secondary"
                ref={text2Ref}
              >
                <p className="sobre-fernando__paragraph">
                  Mi propósito es acompañarte para que puedas <strong>reconectarte con tu propósito más elevado,</strong> liberar los patrones que te limitan y transformar tu realidad desde el plano cuántico, creando una nueva frecuencia de conciencia que te permita <strong>vivir en plenitud y realización.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
