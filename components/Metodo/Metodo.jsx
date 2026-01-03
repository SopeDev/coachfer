"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Metodo.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Metodo() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const sessionsRef = useRef([])

  const phases = [
    {
      number: "01",
      title: "Pilar Espiritual",
      subtitle: "Propósito, legado y diseño divino",
      description: "Trabajamos tu propósito del alma, misión encarnacional y conexión con el 'Cristo Interno'. Transformamos creencias metafísicas limitantes y activamos tu sentido de vida desde niveles superiores de consciencia.",
      result: "Entiendes para qué viniste y qué estás llamada a manifestar como legado."
    },
    {
      number: "02",
      title: "Pilar Mental",
      subtitle: "Programaciones, contratos y patrones heredados",
      description: "Hackeamos programas subconscientes, patrones kármicos y sistema de creencias heredado. Transformamos tu mente reactiva en mente consciente y reescribimos tu narrativa interna.",
      result: "Dejas de operar desde el karma mental y aprendes a operar desde un estado consciente."
    },
    {
      number: "03",
      title: "Pilar Emocional",
      subtitle: "Heridas, memorias celulares y patrones emocionales",
      description: "Transformamos heridas de infancia, heridas del alma y memorias celulares. Liberamos apegos, dependencia y rechazo. Integramos duelos no procesados y trabajamos con respiración emocional.",
      result: "Aprendes a sentir sin colapsar y liberar el dolor acumulado en el cuerpo emocional."
    },
    {
      number: "04",
      title: "Pilar Físico",
      subtitle: "Cuerpo, hábitos y manifestación en la tierra",
      description: "Trabajamos tu anclaje en la realidad, rutinas y disciplina. Transformamos adicciones e impulsos. Materializamos tu propósito y activamos tu fuerza vital y energía sexual.",
      result: "Te vuelves capaz de manifestar, sostener energía y llevar tu misión espiritual a la materia."
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current, ...sessionsRef.current], {
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
    .to(sessionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2
    }, "-=0.5")
  }, { scope: sectionRef })

  return (  
    <section id="metodo" ref={sectionRef} className="metodo">
      <div className="metodo__container">
        <h2 ref={titleRef} className="metodo__title">
          <span className="metodo__title-indigo">AstroHacking</span>: <span className="metodo__title-accent">Reprogramación del Software Astrológico</span>
        </h2>

        <div className="metodo__sessions">
          {phases.map((phase, index) => (
            <div
              key={index}
              ref={el => sessionsRef.current[index] = el}
              className="metodo__session"
            >
              <div className="metodo__session-number">{phase.number}</div>
              <div className="metodo__session-content">
                <h3 className="metodo__session-title">{phase.title}</h3>
                <p className="metodo__session-subtitle">{phase.subtitle}</p>
                <p className="metodo__session-description">{phase.description}</p>
                <p className="metodo__session-result">
                  <strong>Resultado:</strong> {phase.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}