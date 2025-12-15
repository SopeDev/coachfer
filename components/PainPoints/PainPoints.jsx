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
  const pointsRef = useRef([])

  const painPoints = [
    {
      number: "01",
      title: "Heridas Que no Sanan",
      text: "Arrastras heridas que parecen no cerrarse nunca, sin importar cuánto trabajo interno haces. Algo te impide abrirte completamente al amor y la conexión profunda que deseas."
    },
    {
      number: "02",
      title: "Bloqueos y Patrones Repetitivos",
      text: "Falta de seguridad y estabilidad en tu vida, como si el suelo se moviera bajo tus pies. Arrastras patrones repetitivos en tus relaciones que reconoces pero no puedes transformar, atrapado en ciclos que se repiten una y otra vez."
    },
    {
      number: "03",
      title: "Falta de Vitalidad y Poder Personal",
      text: "Inviertes tiempo y dinero en terapia, coaching y trabajo personal, pero sigues sintiéndote sin poder personal, sin la capacidad de tomar decisiones que realmente cambien tu vida."
    },
    {
      number: "04",
      title: "Incapacidad de Expresar tu Verdadero Ser",
      text: "No puedes expresar tu verdad ni comunicar lo que realmente sientes. Algo te silencia desde adentro y te impide hablar con autenticidad."
    },
    {
      number: "05",
      title: "Bloqueado de tu Propósito",
      text: "Sientes que algo te bloquea de vivir tu verdadero propósito. Tienes la intuición profunda de que vienes de vidas pasadas con carga que afecta tu presente, pero no puedes ver el camino para alinear tu destino con tu mejor versión."
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    const cards = pointsRef.current.filter(Boolean)

    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50
    })

    gsap.set(cards, {
      opacity: 0
    })

    // Title animation
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
          Has intentado todo, pero los mismos patrones siguen apareciendo...
        </h2>

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
                <h3 className="pain-points__card-title">{point.title}</h3>
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

