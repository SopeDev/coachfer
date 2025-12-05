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
      title: "Interpretación Cuántica de la Carta Astrológica",
      subtitle: "Aquí identificamos la raíz, no el síntoma.",
      description: "En esta fase, realizo una interpretación cuántica de tu carta astral donde identifico la raíz de tus patrones. Detecto tus heridas raíz del alma (Tikun), ejes nodales y contratos kármicos, patrones inconscientes del linaje, y el mapa de tu destino encarnacional. Te muestro el 'código fuente' de cada planeta, signo y casa, y el lugar exacto donde perdiste tu poder. A nivel cuántico, comprendes cómo vibran tus memorias y qué camino estás ejecutando en automático.",
      image: "/images/session-01.png"
    },
    {
      number: "02",
      title: "Programación y Desprogramación de Patrones",
      subtitle: "Aquí quemamos los viejos programas.",
      description: "En esta fase, trabajamos juntos para reprogramar y desprogramar los patrones que te limitan. Reprogramamos traumas subconscientes, renegociamos contratos kármicos y votos inconscientes, y limpiamos memorias celulares. Utilizamos técnicas de sustitución con mantras, respiración consciente (4-4-8/12), visualización y activación de chakras. Aplicamos el método del Cristo (redención a través del dolor iluminado) y el método del Buda (disolver patrones desde la conciencia testigo).",
      image: "/images/session-02.png"
    },
    {
      number: "03",
      title: "Recodificación con Letras Hebreas y Geometría Sagrada",
      subtitle: "Aquí nace el nuevo Yo.",
      description: "En esta fase final, desde tu nueva frecuencia, activamos tu destino superior. Reconozco tus Dones potenciales y activo el programa de Destino Superior. Diseño y desarrollo una meditación personalizada a través de la activación de las 22 Letras Sagradas hebreas. Anclamos tu nueva identidad cuántica, conectando con tu Yo Ascendido en la quinta dimensión: esa versión tuya que ya logró su propósito. Recodificamos tu sistema energético hacia una nueva línea de realidad.",
      image: "/images/session-03.jpg"
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
        <p ref={subtitleRef} className="metodo__subtitle">
          He diseñado un <strong>método de reprogramación cuántica</strong> que integra astrología cabalística, técnicas de respiración consciente, cristianismo místico, budismo, chakras, mantras y letras hebreas. 
          Este método no solo te muestra por qué repites patrones, sino que los reprograma desde el plano cuántico. 
          Es el puente entre donde estás ahora y donde quieres estar: 
          liberar lo que te amarra al pasado, reprogramar lo que te condiciona, activar lo que te pertenece.
        </p>

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
                <p className="metodo__session-subtitle">"{phase.subtitle}"</p>
                <p className="metodo__session-description">{phase.description}</p>
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

