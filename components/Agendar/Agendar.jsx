"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Agendar.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Calendly URL
const CALENDLY_URL = "https://calendly.com/coachferquintero"

export default function Agendar() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const processBoxRef = useRef(null)
  const calendlyRef = useRef(null)

  // Load Calendly inline widget script
  useEffect(() => {
    // Check if script is already loaded
    if (window.Calendly) {
      return
    }

    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Note: We don't remove the script on unmount as it may be used elsewhere
      // Calendly handles its own cleanup
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !processBoxRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, processBoxRef.current], {
      opacity: 0,
      y: 50
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.7")
    .to(processBoxRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
  }, { scope: sectionRef })

  return (
    <section id="agendar" ref={sectionRef} className="agendar">
      <div className="agendar__container">
        <div className="agendar__content">
          <h2 ref={titleRef} className="agendar__title">
            Reserva tu Sesión de Transformación
          </h2>
          <p ref={subtitleRef} className="agendar__subtitle">
            Elige la fecha y hora que mejor se adapte a tu agenda. Después de agendar, recibirás todas las instrucciones necesarias por email.
          </p>

          {/* Process Info Box */}
          <div ref={processBoxRef} className="agendar__process-box">
            <div className="agendar__process-header">
              <span className="agendar__process-icon">📋</span>
              <h3 className="agendar__process-title">Proceso de Reserva</h3>
            </div>
            <ol className="agendar__process-steps">
              <li className="agendar__process-step">
                <span className="agendar__step-number">1</span>
                <span className="agendar__step-text">Elige tu fecha y hora</span>
              </li>
              <li className="agendar__process-step">
                <span className="agendar__step-number">2</span>
                <span className="agendar__step-text">Recibirás instrucciones de pago por email</span>
              </li>
              <li className="agendar__process-step">
                <span className="agendar__step-number">3</span>
                <span className="agendar__step-text">Realiza el depósito bancario</span>
              </li>
              <li className="agendar__process-step">
                <span className="agendar__step-number">4</span>
                <span className="agendar__step-text">Recibirás el link de Zoom confirmado</span>
              </li>
            </ol>
          </div>

          {/* Calendly Inline Widget */}
          <div className="agendar__calendly-wrapper">
            <div 
              ref={calendlyRef}
              className="calendly-inline-widget" 
              data-url={CALENDLY_URL}
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

