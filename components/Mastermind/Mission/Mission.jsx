'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './Mission.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Mission() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const quoteRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.set([labelRef.current, quoteRef.current], { opacity: 0, y: 30 })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
      .to(labelRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
      .to(quoteRef.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.5')
  }, { scope: sectionRef })

  return (
    <section id="mision" ref={sectionRef} className="mission">
      <div className="mission__glow"></div>
      <div className="mission__container">
        <p ref={labelRef} className="mission__label">Misión</p>
        <blockquote ref={quoteRef} className="mission__quote">
          Entrenar la consciencia para dejar de reaccionar desde el pasado
          y comenzar a crear el futuro de manera consciente.
        </blockquote>
      </div>
    </section>
  )
}
