"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./PainPoints.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function PainPoints() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const pointsRef = useRef([])

  const painPoints = [
    {
      number: "01",
      text: "Inviertes tiempo y dinero en terapia, coaching y trabajo personal, pero los mismos patrones de relación, trabajo o autosabotaje siguen apareciendo"
    },
    {
      number: "02",
      text: "Arrastras heridas emocionales que parecen no cerrarse nunca, sin importar cuánto trabajo interno haces"
    },
    {
      number: "03",
      text: "Sientes que algo te bloquea de vivir tu verdadero propósito o de tener relaciones que realmente funcionan"
    },
    {
      number: "04",
      text: "Vives ciclos repetitivos que reconoces pero no puedes romper, como si estuvieras atrapado en un loop kármico"
    },
    {
      number: "05",
      text: "Tienes la intuición profunda de que vienes de vidas pasadas con carga que está afectando tu presente"
    },
    {
      number: "06",
      text: "Buscas alinear tu destino con tu mejor versión, pero sientes que algo invisible te lo impide"
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    const cards = pointsRef.current.filter(Boolean)

    gsap.set([titleRef.current, subtitleRef.current], {
      opacity: 0,
      y: 50
    })

    gsap.set(cards, {
      opacity: 0
    })

    // Title and subtitle animation
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

    // Animate each card individually based on its position relative to viewport center
    // Cards at the same height will animate simultaneously, cards at different heights will animate in sequence
    cards.forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 55%",
          end: "top 35%",
          scrub: true
        }
      })
    })
  }, { scope: sectionRef })

  return (
    <section id="pain-points" ref={sectionRef} className="pain-points">
      <div className="pain-points__container">
        <h2 ref={titleRef} className="pain-points__title">
          Has intentado todo, pero los mismos patrones siguen apareciendo
        </h2>
        <p ref={subtitleRef} className="pain-points__subtitle">
          Si reconoces alguna de estas señales, significa que estás listo para un cambio que va más allá de la terapia tradicional o el trabajo personal superficial:
        </p>

        <div className="pain-points__grid">
          {painPoints.map((point, index) => (
            <div
              key={index}
              ref={el => pointsRef.current[index] = el}
              className="pain-points__card"
            >
              <div className="pain-points__card-bg"></div>
              <div className="pain-points__card-number">{point.number}</div>
              <div className="pain-points__card-content">
                <p className="pain-points__card-text">{point.text}</p>
              </div>
              <div className="pain-points__card-accent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

