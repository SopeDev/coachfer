"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Button from "../Button/Button"
import "./CTA.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function CTA() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current || !ctaRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
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
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
  }, { scope: sectionRef })

  return (
    <section id="cta-final" ref={sectionRef} className="cta">
      <div className="cta__container">
        <div className="cta__content">
          <h2 ref={titleRef} className="cta__title">
            El momento de romper el ciclo es ahora
          </h2>
          <p ref={subtitleRef} className="cta__subtitle">
            Cada día que pasa sin trabajar en tu reprogramación cuántica es otro día repitiendo los mismos patrones. 
            Si llegaste hasta aquí, tu alma ya sabe que es el momento. 
            <br />
            <strong>¿Estás listo para dar el salto?</strong>
          </p>
          <div ref={ctaRef} className="cta__button-wrapper">
            <Button 
              type="primary"
              href="/agendar"
              className="cta__button"
            >
              Agenda tu proceso ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

