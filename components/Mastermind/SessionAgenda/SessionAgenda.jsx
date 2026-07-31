'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './SessionAgenda.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const phases = [
  {
    phase: '01',
    title: 'Lectura del cielo',
    items: [
      'Interpretación de los tránsitos astrológicos de la semana y cómo aprovecharlos.',
      'Astrología, Kabbalah y principios de consciencia aplicados a la vida diaria.'
    ]
  },
  {
    phase: '02',
    title: 'Reprogramación',
    items: [
      'Reprogramación de creencias limitantes mediante AstroHacking.',
      'Integración de polaridades y trabajo con la sombra.',
      'Activación de propósito, misión de vida y toma de decisiones conscientes.'
    ]
  },
  {
    phase: '03',
    title: 'Integración y práctica',
    items: [
      'Ejercicios de respiración, presencia y regulación del sistema nervioso.',
      'Protocolos prácticos para transformar desafíos en oportunidades.',
      'Retos y prácticas para integrar durante la semana.'
    ]
  },
  {
    phase: '04',
    title: 'Comunidad',
    items: [
      'Espacio de preguntas, coaching grupal y acompañamiento.',
      'Comunidad de personas comprometidas con su evolución.'
    ]
  }
]

export default function SessionAgenda() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef([])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...cardsRef.current], {
      opacity: 0,
      y: 36
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out'
      }, '-=0.6')
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      }, '-=0.45')
  }, { scope: sectionRef })

  return (
    <section id="sesion" ref={sectionRef} className="session-agenda">
      <div className="session-agenda__container">
        <h2 ref={titleRef} className="session-agenda__title">
          Qué sucede en cada sesión
        </h2>
        <p ref={subtitleRef} className="session-agenda__subtitle">
          Cuatro momentos que estructuran el laboratorio semanal
        </p>

        <div className="session-agenda__grid">
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              ref={(el) => { cardsRef.current[index] = el }}
              className="session-agenda__card"
            >
              <span className="session-agenda__phase">Fase {phase.phase}</span>
              <h3 className="session-agenda__card-title">{phase.title}</h3>
              <ul className="session-agenda__bullets">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
