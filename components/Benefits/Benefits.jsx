"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Benefits.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Benefits() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef([])
  const closingTextRef = useRef(null)

  const transformations = [
    {
      from: "Atrapado en patrones repetitivos que reconoces pero no puedes romper",
      to: "Libre para crear nuevas posibilidades desde la consciencia superior"
    },
    {
      from: "Desconectado de tu propósito, sintiendo que algo falta",
      to: "Alineado con tu misión de alma y tu diseño divino"
    },
    {
      from: "Cargando heridas del pasado y memorias kármicas",
      to: "Sanado energéticamente y activado en tu frecuencia más alta"
    },
    {
      from: "Sin claridad sobre tu camino y bloqueado de tu destino",
      to: "Con un mapa claro de tu propósito y tu legado"
    },
    {
      from: "Viviendo desde el karma y programaciones heredadas",
      to: "Creando desde la consciencia, con poder personal restaurado"
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...cardsRef.current, closingTextRef.current], {
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
    .to(cardsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15
    }, "-=0.5")
    .to(closingTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.3")
  }, { scope: sectionRef })

  return (
    <section id="benefits" ref={sectionRef} className="benefits">
      <div className="benefits__container">
        <h2 ref={titleRef} className="benefits__title">
          La Transformación Que Experimentarás
        </h2>
        <p ref={subtitleRef} className="benefits__subtitle">
          Imagina despertar cada día con claridad absoluta sobre quién eres y para qué viniste. Sin dudas. Sin patrones. Solo propósito.
        </p>

        <div className="benefits__transformations">
          {transformations.map((transformation, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="benefits__card"
            >
              <div className="benefits__card-bg"></div>
              <div className="benefits__card-content">
                <div className="benefits__card-from">
                  <span className="benefits__card-icon">❌</span>
                  <p className="benefits__card-text benefits__card-text--from">
                    {transformation.from}
                  </p>
                </div>
                <div className="benefits__card-arrow">
                  →
                </div>
                <div className="benefits__card-to">
                  <span className="benefits__card-icon">✨</span>
                  <p className="benefits__card-text benefits__card-text--to">
                    {transformation.to}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p ref={closingTextRef} className="benefits__closing">
          Esta transformación no es teoría. Es el resultado que cientos de personas ya experimentaron.
        </p>
      </div>
    </section>
  )
}
