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
          <h2 className="sobre-fernando__cta-text">Conoce al creador del método</h2>
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
                  Mi camino comenzó al cuestionar los fundamentos de la existencia: <strong>quiénes somos y para qué estamos aquí</strong>.
                  Esa búsqueda de autoconocimiento me llevó a recorrer y estudiar distintas disciplinas que, al integrarse, dieron forma a un <strong>método profundo enfocado en el despertar, la expansión y la reprogramación de la conciencia</strong>, integrando:
                </p>
                <ul className="sobre-fernando__features">
                  <li>✓ La astrología psicológica</li>
                  <li>✓ la sabiduría ancestral de la kábbala</li>
                  <li>✓ Principios de la física cuántica</li>
                  <li>✓ Hipnosis y reprogramación subconsciente</li>
                  <li>✓ Regresiones prenatales y a otras vidas</li>
                  <li>✓ Activación de los cuerpos de luz</li>
                </ul>
              </div>

              <div
                className="sobre-fernando__text sobre-fernando__text--secondary"
                ref={text2Ref}
              >
                <p className="sobre-fernando__paragraph">
                  Mi misión en esta vida es guiar y acompañar a quienes sienten el llamado a <strong>reconectarse con su propósito más elevado</strong>, liberando patrones limitantes y transformando el tesoro de toda su experiencia acumulada, integrando la historia y sanando la carga emocional para convertirla en un <strong>camino de ascensión consciente y de autorrealización</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
