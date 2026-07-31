'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './Modality.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const modalities = [
  {
    label: 'Formato',
    value: 'Zoom en vivo',
    icon: 'video'
  },
  {
    label: 'Frecuencia',
    value: 'Sesiones semanales o quincenales, según la modalidad',
    icon: 'calendar'
  },
  {
    label: 'Duración',
    value: '90 a 120 minutos',
    icon: 'clock'
  },
  {
    label: 'Grabaciones',
    value: 'Acceso a las grabaciones de las sesiones',
    icon: 'play'
  },
  {
    label: 'Materiales',
    value: 'Materiales y ejercicios de integración',
    icon: 'book'
  },
  {
    label: 'Comunidad',
    value: 'Grupo privado de acompañamiento',
    icon: 'people'
  }
]

const icons = {
  video: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10l6-3v10l-6-3V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 16.5v-11z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 16.5A2.5 2.5 0 016.5 19H20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 19c0-2.2-1.5-3.8-3.5-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Modality() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.set([titleRef.current, ...cardsRef.current], { opacity: 0, y: 32 })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out'
      }, '-=0.5')
  }, { scope: sectionRef })

  return (
    <section id="modalidad" ref={sectionRef} className="modality">
      <div className="modality__container">
        <h2 ref={titleRef} className="modality__title">Modalidad</h2>
        <div className="modality__grid">
          {modalities.map((item, index) => (
            <article
              key={item.label}
              ref={(el) => { cardsRef.current[index] = el }}
              className="modality__card"
            >
              <div className="modality__icon">{icons[item.icon]}</div>
              <p className="modality__label">{item.label}</p>
              <p className="modality__value">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
