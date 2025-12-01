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

  const sessions = [
    {
      number: "01",
      title: "Diagnóstico Cuántico",
      description: "En nuestra primera sesión juntos, realizo una Interpretación Cuántica de tu Carta Astral donde te muestro el mapa completo de tu encarnación. Identifico tus heridas raíz, contratos kármicos, patrones familiares que se repiten y bloqueos de propósito. A nivel cuántico, te muestro cómo vibran tus memorias y qué camino estás ejecutando en automático. Comprenderás por qué elegiste esta vida y qué aprendizajes trae tu alma.",
      image: "/images/session1.png"
    },
    {
      number: "02",
      title: "Reprogramación Lunar y Kármica",
      description: "En nuestra segunda sesión, trabajamos juntos el programa de tu alma a través de tus Nodos Lunares y Ejes Kármicos. Te muestro tu nodo sur (lo que vienes a corregir) y tu nodo norte (tu misión evolutiva). A través del poder de las letras hebreas de la Kabbalah, reprogramamos juntos el código cuántico que sostiene la distorsión en tu realidad. Cortamos contratos, limpiamos memorias ancestrales y desactivamos traumas.",
      image: "/images/session-02.jpg"
    },
    {
      number: "03",
      title: "Activación y Recodificación Hebrea",
      description: "En nuestra tercera sesión, desde tu nueva frecuencia, abrimos juntos el portal de tu destino superior. Cada signo, planeta y sefirá del Árbol de la Vida tiene una letra hebrea asociada que corregimos distorsiones y limpiamos memorias. Conectamos con tu Yo Ascendido en la quinta dimensión: esa versión tuya que ya logró su propósito. Anclamos su energía en el presente, recodificando tu sistema energético hacia una nueva línea de realidad.",
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
          He diseñado un proceso de <strong>3 sesiones</strong> que no solo te muestra por qué repites patrones, sino que los reprograma desde el plano cuántico. 
          Este es el puente entre donde estás ahora y donde quieres estar: 
          liberar lo que te amarra al pasado, reprogramar lo que te condiciona, activar lo que te pertenece.
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
              <div className="metodo__session-image">
                <img 
                  src={session.image} 
                  alt={session.title}
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

