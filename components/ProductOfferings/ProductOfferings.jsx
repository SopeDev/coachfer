'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../Button/Button'
import './ProductOfferings.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const offerings = [
  {
    id: 'coaching',
    label: 'Camino individual',
    title: 'Coaching Privado',
    description:
      'Un proceso personalizado e intensivo para reprogramar tu destino en sesiones privadas. Profundidad, claridad y acompañamiento uno a uno.',
    points: [
      'Sesiones individuales a tu ritmo',
      'Paquetes de transformación profunda',
      'Enfoque en tu carta y tu propósito'
    ],
    href: '/coaching',
    cta: 'Explorar coaching',
    tone: 'personal'
  },
  {
    id: 'mastermind',
    label: 'Camino colectivo',
    title: 'Mastermind: Entrenamiento de la Conciencia',
    description:
      'Un laboratorio semanal en vivo para elevar, expandir y reprogramar tu consciencia, hackeando las energías astrológicas del momento.',
    points: [
      'Sesiones grupales en vivo por Zoom',
      'Créditos flexibles por paquete',
      'Comunidad, grabaciones y prácticas'
    ],
    href: '/mastermind',
    cta: 'Ver mastermind',
    tone: 'collective'
  }
]

export default function ProductOfferings() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const itemsRef = useRef([])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...itemsRef.current], {
      opacity: 0,
      y: 40
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, '-=0.6')
      .to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15
      }, '-=0.5')
  }, { scope: sectionRef })

  return (
    <section id="caminos" ref={sectionRef} className="product-offerings">
      <div className="product-offerings__container">
        <h2 ref={titleRef} className="product-offerings__title">
          Dos caminos. Una misma consciencia.
        </h2>
        <p ref={subtitleRef} className="product-offerings__subtitle">
          Elige el formato que resuene con donde estás ahora: un proceso íntimo
          y personalizado, o un entrenamiento vivo y colectivo.
        </p>

        <div className="product-offerings__grid">
          {offerings.map((offering, index) => (
            <article
              key={offering.id}
              ref={(el) => {
                itemsRef.current[index] = el
              }}
              className={`product-offerings__item product-offerings__item--${offering.tone}`}
            >
              <p className="product-offerings__label">{offering.label}</p>
              <h3 className="product-offerings__name">{offering.title}</h3>
              <p className="product-offerings__description">{offering.description}</p>
              <ul className="product-offerings__points">
                {offering.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Button
                type="primary"
                href={offering.href}
                className="product-offerings__cta"
              >
                {offering.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
