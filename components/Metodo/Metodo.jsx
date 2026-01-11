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

  const pillars = [
    {
      title: "Pilar Espiritual",
      subtitle: "Propósito, legado y diseño divino",
      description: "Trabajamos con tu misión encarnacional, tu programa de destino superior y la reconexión con la consciencia de unidad, que trasciende la dualidad. Transformamos creencias antiguas, elevando tu visión y el sentido de propósito.",
      result: "Recuerdas quién realmente eres y a qué viniste a esta vida."
    },
    {
      title: "Pilar Mental",
      subtitle: "Programaciones, contratos y patrones heredados",
      description: "Hackeamos programas subconscientes, patrones kármicos y tu sistema de creencias heredado. Transformamos tu nivel de percepción desde la mente racional hacia la conciencia superior.",
      result: "Dejas de operar desde el programa inferior y modificas tu diálogo interno para que sirva a la manifestación de tu propósito."
    },
    {
      title: "Pilar Emocional",
      subtitle: "Heridas, memorias celulares y patrones emocionales",
      description: "Transformamos heridas de infancia, heridas del alma y memorias celulares. Convertimos el dolor emocional en poder personal, liberando apegos e integrando duelos no procesados.",
      result: "Aprendes a reconocer el verdadero poder de las emociones como un tesoro de tu alma para tu ascensión."
    },
    {
      title: "Pilar Físico",
      subtitle: "Cuerpo, hábitos y manifestación en la materia",
      description: "Trabajamos tu anclaje en la realidad, reprogramando hábitos y adicciones nocivas. Transformamos y recuperamos tu energía vital hacia la materialización de tu propósito.",
      result: "Reconoces tu cuerpo como un templo del espíritu y aprendes a cultivar y canalizar tu energía sexual de forma elevada."
    }
  ]

  const quadrantRef = useRef(null)
  const introRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current, introRef.current, quadrantRef.current], {
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
    .to(introRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
    .to(quadrantRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5")
  }, { scope: sectionRef })

  return (  
    <section id="metodo" ref={sectionRef} className="metodo">
      <div className="metodo__container">
        <h2 ref={titleRef} className="metodo__title">
          <span className="metodo__title-indigo">AstroHacking</span>: <span className="metodo__title-accent">Reprogramación del Software Astrológico</span>
        </h2>

        <div className="metodo__quadrant-card">
          <div ref={introRef} className="metodo__quadrant-intro">
            <h3 className="metodo__quadrant-intro-title">Método Integrado de 4 Pilares</h3>
            <p className="metodo__quadrant-intro-text">Estos cuatro pilares trabajan simultáneamente como dimensiones interconectadas para una transformación holística completa.</p>
          </div>

          <div ref={quadrantRef} className="metodo__quadrant-grid">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="metodo__quadrant-item"
              >
                <h3 className="metodo__quadrant-title">{pillar.title}</h3>
                <p className="metodo__quadrant-subtitle">{pillar.subtitle}</p>
                <p className="metodo__quadrant-description">{pillar.description}</p>
                <div className="metodo__quadrant-result">
                  <div className="metodo__quadrant-result-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="metodo__quadrant-result-content">
                    <strong>Resultado:</strong> {pillar.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}