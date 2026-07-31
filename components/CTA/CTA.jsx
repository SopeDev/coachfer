'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import StartInterestButton from '../StartInterestButton/StartInterestButton'
import { trackWhatsAppClick } from '../../lib/analytics'
import './CTA.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function CTA() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const buttonRef = useRef(null)
  const arcRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current || !arcRef.current) return

    gsap.set([titleRef.current, textRef.current, buttonRef.current], {
      opacity: 0,
      y: 30
    })
    gsap.set(arcRef.current, {
      opacity: 0,
      scale: 0.8,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%'
    })

    const portalTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })

    portalTl
      .to(arcRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.8')
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3')

    gsap.to(arcRef.current, {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: 'none'
    })
  }, { scope: sectionRef })

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section id="cta-final" ref={sectionRef} className="cta">
      <svg
        ref={arcRef}
        className="cta__arc"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 40 100 A 160 160 0 0 1 360 100"
          fill="none"
          stroke="rgba(58, 24, 177, 0.1)"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(180 200 100)"
        />
        <path
          d="M 50 100 A 150 150 0 0 1 350 100"
          fill="none"
          stroke="rgba(58, 24, 177, 0.15)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="cta__container">
        <div className="cta__content">
          <h2 ref={titleRef} className="cta__title">
            EL MOMENTO DE<br />
            ROMPER EL CICLO<br />
            ES AHORA
          </h2>

          <p ref={textRef} className="cta__text">
            Tu transformación comienza con una decisión consciente.<br />
            Este es el umbral hacia tu propósito superior.
          </p>

          <div ref={buttonRef} className="cta__button-wrapper">
            <StartInterestButton
              type="primary"
              product="COACHING"
              className="cta__button"
              onClick={() => trackWhatsAppClick('cta_section')}
            >
              Crear cuenta y continuar
            </StartInterestButton>
          </div>
        </div>
      </div>
    </section>
  )
}
