"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Button from "../Button/Button"
import "./Hero.scss"

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const ctaRef = useRef(null)
  const starsRef = useRef(null)

  useEffect(() => {
    // Create dynamic stars
    if (starsRef.current) {
      const starsContainer = starsRef.current
      const starCount = 150

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div")
        star.className = "hero__star"
        
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

        starsContainer.appendChild(star)
      }
    }
  }, [])

  useEffect(() => {
    const description = document.querySelector('.hero__description')
    if (!titleRef.current || !ctaRef.current || !description) return

    gsap.set([titleRef.current, description, ctaRef.current], {
      opacity: 0,
      y: 30
    })

    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    })
    .to(description, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1")
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8")
  }, [])

  return (
    <section id="inicio" ref={heroRef} className="hero">
      <div ref={starsRef} className="hero__stars-container"></div>
      <div className="hero__glow"></div>
      
      <div className="hero__container">
        <div className="hero__content">
          <h1 ref={titleRef} className="hero__title">
            Renace en tu Propósito
          </h1>
          <p className="hero__description">
            ¿Sientes que repites los mismos patrones? ¿Que algo te impide vivir tu verdadero propósito? 
            La <strong>Reprogramación Cuántica del Destino</strong> es un método único de 3 sesiones que libera 
            las limitaciones kármicas, sana las heridas del alma y activa tu máximo potencial. 
            Transforma tu realidad desde el plano cuántico.
          </p>
          <Button 
            ref={ctaRef}
            type="primary"
            href="#agendar"
            className="hero__cta"
          >
            Agenda tu proceso
          </Button>
        </div>
      </div>
    </section>
  )
}
