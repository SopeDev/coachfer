"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Button from "../Button/Button"
import "./Hero.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const ctaRef = useRef(null)
  const starsRef = useRef(null)
  const starsArrayRef = useRef([])

  useGSAP(() => {
    // Create dynamic stars and apply parallax
    if (starsRef.current && heroRef.current) {
      const starsContainer = starsRef.current
      const starCount = 100
      const stars = []

      // Create stars
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
        // Enable hardware acceleration
        star.style.willChange = "transform, opacity"

        starsContainer.appendChild(star)
        stars.push(star)
      }

      starsArrayRef.current = stars

      // Set initial state for entrance animation (stars start from bottom, invisible)
      gsap.set(stars, {
        opacity: 0,
        y: 100 // Start 100px below their final position
      })

      // Animate stars entrance from bottom
      gsap.to(stars, {
        opacity: 0.3, // Final opacity (from CSS)
        y: 0,
        duration: 1.5,
        ease: "expo.out", // Fast start, slow end
        delay: 0.3 // Small delay before stars start appearing
      })

      // Apply parallax effect to ALL stars
      // Wait a frame to ensure DOM is ready
      requestAnimationFrame(() => {
        const heroHeight = heroRef.current.offsetHeight || window.innerHeight

        stars.forEach((star) => {
          // Different parallax speeds: from 0.5 to 2.5 (noticeable range)
          const parallaxSpeed = 0.5 + (Math.random() * 2.0) // Range: 0.5 to 2.5
          
          // Calculate movement based on hero height - reduced intensity (0.4 instead of 0.8)
          const movementY = heroHeight * 0.4 * parallaxSpeed
          
          // Parallax animation with ScrollTrigger - using force3D for hardware acceleration
          gsap.to(star, {
            y: -movementY, // Move up as user scrolls down, back as scroll up
            ease: "none",
            force3D: true, // Force hardware acceleration
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1, // Smooth scrubbing - automatically bidirectional
              invalidateOnRefresh: true
            }
          })
        })
      })
    }

    const description = document.querySelector('.hero__description')
    if (!titleRef.current || !ctaRef.current || !description) return

    gsap.set(titleRef.current, {
      opacity: 0,
      y: 30
    })

    gsap.set([description, ctaRef.current], {
      opacity: 0
    })

    // Stars animation: delay 0.3s, duration 1.5s (ends ~1.8s)
    // Start title after stars finish
    const tl = gsap.timeline({ delay: 1.8 })
    
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    })
    .to([description, ctaRef.current], {
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.5") // Start simultaneously 0.5s before title ends
  }, { scope: heroRef })

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
            Mi método de <strong>AstroHacking: Reprogramación del Software Astrológico</strong> es un proceso único de 3 sesiones que libera 
            las limitaciones kármicas, sana las heridas del alma y activa tu máximo potencial. 
            Te ayudo a transformar tu realidad desde el plano cuántico.
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
