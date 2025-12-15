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
  const subtitleRef = useRef(null)
  const sessionsRef = useRef([])

  const phases = [
    {
      number: "01",
      title: "Pilar Espiritual",
      subtitle: "Propósito, legado y diseño divino",
      description: "Aquí trabajamos tu propósito del alma (Sol, Casa 9, Nodo Norte, tikun), tu misión encarnacional y legado (Medio Cielo), y tu conexión con el 'Cristo Interno'. Reconoces el juego espiritual desde tu alma observadora. Transformamos tus creencias metafísicas limitantes y activamos tu sentido de vida desde niveles superiores de consciencia. Utilizamos letras hebreas del tikun del alma, meditaciones cabalísticas, técnicas de observador budista y respiración que activa coronilla–corazón.",
      result: "Entiendes para qué viniste, qué viniste a corregir y qué estás llamada a manifestar como legado.",
      image: "/images/pilar-espiritual.png"
    },
    {
      number: "02",
      title: "Pilar Mental",
      subtitle: "Programaciones, contratos y patrones heredados",
      description: "Aquí hackeamos tus programas subconscientes (Mercurio), patrones kármicos repetitivos, sistema de creencias heredado (Luna y Casa 4), ego y máscaras del personaje ficticio (Ascendente). Transformamos tu mente reactiva en mente consciente, liberamos contratos de vidas pasadas (Nodo Sur) y reescribimos tu narrativa interna. Aplicamos técnicas de reprogramación cuántica (4-4-8/12), hackeo del ego, sanación de patrones transgeneracionales y ejercicios de reescritura de identidad.",
      result: "Dejas de operar desde el karma mental y aprendes a operar desde un estado consciente y autorregulado.",
      image: "/images/pilar-mental.png"
    },
    {
      number: "03",
      title: "Pilar Emocional",
      subtitle: "Heridas, memorias celulares y patrones emocionales",
      description: "Aquí transformamos las heridas de infancia (Luna), heridas del alma (aspectos Plutón–Quirón), memorias celulares y traumas. Liberamos apegos, dependencia, abandono y rechazo. Rompemos la repetición por resonancia emocional e integramos duelos no procesados. Trabajamos con respiración emocional para soltar densidad, activación de chakras inferiores, Venus, Luna y Casa 8. Aplicamos procesos de compasión cristiana y observación emocional budista sin juicio.",
      result: "Aprendes a sentir sin colapsar, soltar lo que no es tuyo y liberar el dolor acumulado en el cuerpo emocional.",
      image: "/images/pilar-emocional.png"
    },
    {
      number: "04",
      title: "Pilar Físico",
      subtitle: "Cuerpo, hábitos y manifestación en la tierra",
      description: "Aquí trabajamos tu anclaje en la realidad (Casa 2 y 6), rutinas, hábitos y disciplina. Cuidamos tu cuerpo como vehículo del alma. Transformamos adicciones, impulsos y compulsiones. Materializamos tu propósito (Saturno) y activamos tu fuerza vital y energía sexual (Marte). Fortalecemos tu relación con la tierra y tu poder de acción. Utilizamos respiración para activar el sistema parasimpático, detox energético, rituales de anclaje, microhábitos de alineación diaria y trabajo somático.",
      result: "Te vuelves capaz de manifestar, sostener energía, tener disciplina y llevar tu misión espiritual a la materia.",
      image: "/images/pilar-fisico.png"
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...sessionsRef.current], {
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

    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.7")
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
        <p ref={subtitleRef} className="metodo__subtitle">
          Para lograr mi propósito, he diseñado una <strong>metodología multidimensional basado en los 4 Pilares de la Ascensión</strong> que integra astrología cabalística, respiración consciente, reprogramación cuántica, psicología espiritual, cristianismo místico, budismo, chakras, mantras y letras hebreas. 
          Cada sesión trabaja simultáneamente las capas astrológica, subconsciente, energética, espiritual y física de tu ser. 
          Este método no solo te muestra por qué repites patrones, sino que los reprograma desde el plano cuántico: donde reescribes tu programación astrológica desde la consciencia superior y transformas tu carta natal en su versión más alta.
        </p>
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
              <div className="metodo__session-number">
                {phase.number}
              </div>
              <div className="metodo__session-content">
                <h3 className="metodo__session-title">{phase.title}</h3>
                <p className="metodo__session-subtitle">"{phase.subtitle}"</p>
                <p className="metodo__session-description">{phase.description}</p>
                <p className="metodo__session-result">
                  <strong>Resultado:</strong> {phase.result}
                </p>
              </div>
              <div className="metodo__session-image">
                <img 
                  src={phase.image} 
                  alt={phase.title}
                  className="metodo__session-img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}