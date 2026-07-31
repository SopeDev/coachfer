'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../../Button/Button'
import StartInterestButton from '../../StartInterestButton/StartInterestButton'
import './MastermindHero.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function MastermindHero() {
  const heroRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const starsRef = useRef(null)

  useGSAP(() => {
    if (starsRef.current && heroRef.current) {
      const starsContainer = starsRef.current
      const starCount = 100
      const stars = []

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'mastermind-hero__star'

        const size = Math.random() * 2 + 0.5
        const x = Math.random() * 100
        const y = Math.random() * 100
        const delay = Math.random() * 5
        const duration = Math.random() * 3 + 2

        star.style.width = `${size}px`
        star.style.height = `${size}px`
        star.style.left = `${x}%`
        star.style.top = `${y}%`
        star.style.animationDelay = `${delay}s`
        star.style.animationDuration = `${duration}s`
        star.style.willChange = 'transform, opacity'

        starsContainer.appendChild(star)
        stars.push(star)
      }

      gsap.set(stars, {
        opacity: 0,
        y: 100
      })

      gsap.to(stars, {
        opacity: 0.3,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        delay: 0.3
      })

      requestAnimationFrame(() => {
        const heroHeight = heroRef.current.offsetHeight || window.innerHeight

        stars.forEach((star) => {
          const parallaxSpeed = 0.5 + Math.random() * 2.0
          const movementY = heroHeight * 0.4 * parallaxSpeed

          gsap.to(star, {
            y: -movementY,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true
            }
          })
        })
      })
    }

    if (!eyebrowRef.current || !titleRef.current || !contentRef.current) return

    gsap.set([eyebrowRef.current, titleRef.current], { opacity: 0, y: 28 })
    gsap.set(contentRef.current, { opacity: 0 })

    const tl = gsap.timeline({ delay: 1.8 })
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.55')
      .to(contentRef.current, { opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
  }, { scope: heroRef })

  return (
    <section id="inicio" ref={heroRef} className="mastermind-hero">
      <div ref={starsRef} className="mastermind-hero__stars"></div>
      <div className="mastermind-hero__glow"></div>
      <div className="mastermind-hero__vignette"></div>

      <div className="mastermind-hero__container">
        <div className="mastermind-hero__content hero__content">
          <p ref={eyebrowRef} className="mastermind-hero__eyebrow">
            Mastermind
          </p>
          <h1 ref={titleRef} className="mastermind-hero__title">
            Entrenamiento de la Consciencia
          </h1>
          <div ref={contentRef} className="mastermind-hero__body">
            <p className="mastermind-hero__lead">
              Un laboratorio semanal para elevar, expandir y reprogramar la
              consciencia, hackeando las energías astrológicas del momento.
            </p>
            <p className="mastermind-hero__flyer">
              “La consciencia no se alcanza en un solo curso… se fortalece con entrenamiento.”
            </p>
            <div className="mastermind-hero__actions">
              <Button type="primary" href="#paquetes">
                Ver paquetes
              </Button>
              <StartInterestButton
                type="secondary"
                product="MASTERMIND"
                className="mastermind-hero__secondary"
              >
                Crear cuenta y continuar
              </StartInterestButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
