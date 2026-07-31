'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../Button/Button'
import './HomeCTA.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HomeCTA({ tone = 'soft' }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const actionsRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.set([titleRef.current, textRef.current, actionsRef.current], {
      opacity: 0,
      y: 30
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .to(actionsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
  }, { scope: sectionRef })

  return (
    <section
      id="cta-final"
      ref={sectionRef}
      className={`home-cta${tone === 'white' ? ' home-cta--white' : ''}`}
    >
      <div className="home-cta__container">
        <h2 ref={titleRef} className="home-cta__title">
          Elige cómo quieres entrenar tu consciencia
        </h2>
        <p ref={textRef} className="home-cta__text">
          Ya sea en un proceso privado o en un laboratorio semanal colectivo,
          AstroHacking® te acompaña a dejar de reaccionar desde el pasado
          y comenzar a crear tu futuro con claridad.
        </p>
        <div ref={actionsRef} className="home-cta__actions">
          <Button type="primary" href="/coaching">
            Coaching privado
          </Button>
          <Button type="secondary" href="/mastermind" className="home-cta__secondary">
            Mastermind
          </Button>
        </div>
      </div>
    </section>
  )
}
