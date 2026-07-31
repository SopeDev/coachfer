'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import './MastermindIntro.scss'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function MastermindIntro() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const bridgeRef = useRef(null)
  const supportRef = useRef(null)
  const splitTextRef = useRef(null)

  useGSAP(() => {
    if (!textRef.current || !sectionRef.current) return

    gsap.set([bridgeRef.current, supportRef.current], {
      opacity: 0,
      y: 24
    })

    document.fonts.ready.then(() => {
      splitTextRef.current = new SplitText(textRef.current, {
        type: 'chars,words'
      })

      const chars = splitTextRef.current.chars
      gsap.set(chars, { color: '#eeeeee' })

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'center center',
          scrub: true
        }
      }).to(chars, {
        color: '#2a0f7d',
        ease: 'none',
        stagger: {
          each: 1 / chars.length
        }
      })
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none'
      }
    })
      .to(bridgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(supportRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, '-=0.55')
  }, { scope: sectionRef })

  return (
    <section id="mensaje" ref={sectionRef} className="mastermind-intro">
      <div className="mastermind-intro__container">
        <p ref={textRef} className="mastermind-intro__quote">
          No basta con despertar… hay que entrenar la consciencia todos los días.
        </p>
        <p ref={bridgeRef} className="mastermind-intro__bridge">
          Entrenar la consciencia para dejar de reaccionar desde el pasado
          y comenzar a crear el futuro de manera consciente.
        </p>
        <p ref={supportRef} className="mastermind-intro__support">
          Este espacio es un entrenamiento vivo: semanal, práctico y colectivo.
          No es un curso que se consume una vez — es una práctica para fortalecer
          tu claridad, tu frecuencia y tu capacidad de crear desde el presente.
        </p>
      </div>
    </section>
  )
}
