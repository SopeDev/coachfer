"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./Metodo.scss"

gsap.registerPlugin(ScrollTrigger)

export default function Metodo() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const sessionsRef = useRef([])

  const sessions = [
    {
      number: "01",
      title: "El Programa del Alma",
      description: "Lectura Cuántica de tu Carta Natal: descubrirás el mapa de tu encarnación, tus misiones, contratos, desafíos y talentos. Comprenderás por qué elegiste esta vida, qué pactos hiciste antes de nacer y qué aprendizajes trae tu alma. Es el recuerdo del propósito original."
    },
    {
      number: "02",
      title: "Reprogramación Kármica y Sanación de Linaje",
      description: "A través del poder de las letras hebreas de la Kabbalah, conectadas con los planetas y los signos, trabajamos las memorias kármicas, las heridas de la infancia, las creencias de carencia y los programas ancestrales. Cada letra es una inteligencia creadora: al vibrarla, visualizarla y sentirla, reprogramas el código cuántico que sostiene la distorsión en tu realidad. Liberas el pasado y restauras el equilibrio del alma."
    },
    {
      number: "03",
      title: "Activación del Propósito y del Yo del Futuro",
      description: "Desde tu nueva frecuencia, abrimos el portal de tu destino superior, conectando con tu Yo Ascendido en la quinta dimensión: esa versión tuya que ya logró su propósito, que vive en abundancia, salud, amor y realización plena. Anclamos su energía en el presente, expandiendo tu campo cuántico hacia una nueva línea de realidad."
    }
  ]

  useEffect(() => {
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section id="metodo" ref={sectionRef} className="metodo">
      <div className="metodo__container">
        <h2 ref={titleRef} className="metodo__title">
          La <span className="metodo__title-accent">Reprogramación Cuántica del Destino</span>
        </h2>
        <p ref={subtitleRef} className="metodo__subtitle">
          Un proceso de <strong>3 sesiones profundas</strong>, diseñado para reconectarte con tu plan del alma, 
          liberar las limitaciones y activar tu máximo potencial de destino.
        </p>

        <div className="metodo__sessions">
          {sessions.map((session, index) => (
            <div
              key={index}
              ref={el => sessionsRef.current[index] = el}
              className="metodo__session"
            >
              <div className="metodo__session-number">{session.number}</div>
              <div className="metodo__session-content">
                <h3 className="metodo__session-title">{session.title}</h3>
                <p className="metodo__session-description">{session.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

