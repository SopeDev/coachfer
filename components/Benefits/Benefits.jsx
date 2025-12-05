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
  const benefitsRef = useRef([])
  const resultsRef = useRef(null)

  const benefits = [
    {
      text: <><strong>Identificar tu herida raíz</strong> que gobierna tu vida desde el inconsciente</>
    },
    {
      text: <><strong>Transformar traumas kármicos</strong> y memorias de vidas pasadas que te limitan</>
    },
    {
      text: <><strong>Reprogramar patrones ancestrales</strong> heredados de tu línea familiar</>
    },
    {
      text: <><strong>Cortar contratos energéticos</strong> que te mantienen en ciclos repetitivos</>
    },
    {
      text: <><strong>Activar tu propósito superior</strong> y recuperar tu poder personal</>
    },
    {
      text: <><strong>Alinear tus 7 chakras</strong> con tu destino más elevado</>
    },
    {
      text: <><strong>Recodificar tu alma</strong> con las vibraciones de las letras hebreas</>
    }
  ]

  const finalResults = [
    "Un código nuevo instalado",
    "Una herida desactivada",
    "Un rumbo despejado",
    "Una activación energética real",
    "Una versión de ti que vibra más alto, más claro y más libre"
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...benefitsRef.current, resultsRef.current], {
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
    .to(benefitsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1
    }, "-=0.5")
    .to(resultsRef.current, {
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
          Lo que cambia cuando trabajamos desde el plano cuántico
        </h2>
        <p ref={subtitleRef} className="benefits__subtitle">
          A diferencia de otros métodos que solo trabajan en la superficie, AstroHacking reprograma el código energético que determina tu destino. Esto es lo que lograrás:
        </p>

        <div className="benefits__list">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={el => benefitsRef.current[index] = el}
              className="benefits__item"
            >
              <div className="benefits__check">✓</div>
              <p className="benefits__text">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div ref={resultsRef} className="benefits__results">
          <h3 className="benefits__results-title">Cuando sales de nuestras sesiones</h3>
          <p className="benefits__results-subtitle">
            No es teoría. No es motivación temporal. Es una transformación real que llevas contigo:
          </p>
          <div className="benefits__results-list">
            {finalResults.map((result, index) => (
              <div key={index} className="benefits__result-item">
                <span className="benefits__result-icon">✨</span>
                <span className="benefits__result-text">{result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

