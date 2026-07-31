'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './IdealFor.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const profiles = [
  {
    number: '01',
    title: 'Romper el ciclo',
    text: 'Personas que desean romper patrones repetitivos y elevar su frecuencia y claridad mental.'
  },
  {
    number: '02',
    title: 'Vivir con propósito',
    text: 'Quienes buscan mayor coherencia, propósito y una práctica constante de crecimiento personal.'
  },
  {
    number: '03',
    title: 'Leer el cielo',
    text: 'Comprender los mensajes de su carta natal y utilizar la energía de los tránsitos a su favor.'
  },
  {
    number: '04',
    title: 'Hábitos conscientes',
    text: 'Crear hábitos sostenibles y mantener un entrenamiento semanal que ancle la transformación.'
  }
]

export default function IdealFor() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    const cards = cardsRef.current.filter(Boolean)

    gsap.set(titleRef.current, { opacity: 0, y: 40 })
    gsap.set(cards, { opacity: 0 })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }).to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })

    cards.forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 55%',
          end: 'top 35%',
          scrub: true
        }
      })
    })
  }, { scope: sectionRef })

  return (
    <section id="ideal" ref={sectionRef} className="ideal-for">
      <div className="ideal-for__container">
        <h2 ref={titleRef} className="ideal-for__title">Ideal para</h2>

        <div className="ideal-for__grid">
          {profiles.map((profile, index) => (
            <article
              key={profile.title}
              ref={(el) => { cardsRef.current[index] = el }}
              className="ideal-for__card"
            >
              <div className="ideal-for__card-bg" />
              <span className="ideal-for__card-number">{profile.number}</span>
              <div className="ideal-for__card-content">
                <h3 className="ideal-for__card-title">{profile.title}</h3>
                <p className="ideal-for__card-text">{profile.text}</p>
              </div>
              <div className="ideal-for__card-accent" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
