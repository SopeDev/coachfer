"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import "./SobreFernando.scss"

gsap.registerPlugin(ScrollTrigger)

export default function SobreFernando() {
  const sectionRef = useRef(null)
  const leftImageRef = useRef(null)

  useEffect(() => {
    if (!leftImageRef.current || !sectionRef.current) return

    // Parallax effect for left image (Fernando)
    // Image is at 0% transform when section is centered in viewport (accounting for navbar)
    const navbar = document.querySelector('.navbar')
    const navbarHeight = navbar ? navbar.offsetHeight : 0
    const viewportHeight = window.innerHeight
    const adjustedCenter = viewportHeight / 2 + navbarHeight / 2
    
    const parallaxAnimation = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom", // Start when section enters viewport
      end: "bottom top", // End when section leaves viewport
      scrub: true,
      onUpdate: (self) => {
        // Get current position of section center relative to viewport
        const triggerRect = sectionRef.current.getBoundingClientRect()
        const sectionCenter = triggerRect.top + triggerRect.height / 2
        
        // Calculate progress where 0.5 = section center at adjustedCenter
        // When section enters: sectionCenter ≈ viewportHeight (progress should be close to 0)
        // When section centered: sectionCenter = adjustedCenter (progress should be 0.5)
        // When section exits: sectionCenter ≈ -sectionHeight/2 (progress should be close to 1)
        
        const sectionHeight = triggerRect.height
        const totalRange = viewportHeight + sectionHeight / 2
        
        // Raw progress: 0 when section enters, 1 when section exits
        const rawProgress = (viewportHeight - sectionCenter + sectionHeight / 2) / totalRange
        
        // Adjust: shift so that when sectionCenter = adjustedCenter, progress = 0.5
        const centerProgress = (viewportHeight - adjustedCenter + sectionHeight / 2) / totalRange
        const adjustedProgress = rawProgress + (0.5 - centerProgress)
        const progress = Math.max(0, Math.min(1, adjustedProgress))
        
        // When progress is 0.5 (section centered accounting for navbar), yPercent should be 0
        // Range: +15% to -15%, with 0 at center (inverted direction)
        const yPercent = (0.5 - progress) * 30 // Maps 0-1 progress to +15 to -15
        gsap.set(leftImageRef.current, {
          yPercent: yPercent
        })
      }
    })

    return () => {
      if (parallaxAnimation) {
        parallaxAnimation.kill()
      }
    }
  }, [])

  return (
    <section id="sobre" ref={sectionRef} className="sobre-fernando">
      <div className="sobre-fernando__container">
        <div className="sobre-fernando__content">
          {/* Left: Fernando's image */}
          <div ref={leftImageRef} className="sobre-fernando__image-parallax">
            <Image
              src="/images/about.jpg"
              alt="Fernando Quintero"
              width={600}
              height={800}
              className="sobre-fernando__image sobre-fernando__image--left"
            />
          </div>
          
          {/* Center: Combined text */}
          <div className="sobre-fernando__text">
            <p className="sobre-fernando__paragraph">
              Mi enfoque ha evolucionado desde lecturas astrológicas tradicionales hacia un
              <strong>método profundo de reprogramación cuántica</strong>
              que integra la sabiduría ancestral de la Kabbalah con principios de física cuántica, diseñado para quienes están listos para
              <strong>liberar sus limitaciones kármicas y activar su máximo potencial.</strong>
            </p>
            <p className="sobre-fernando__paragraph">
              Mi propósito es acompañarte para que puedas
              <strong>reconectarte con tu propósito más elevado,</strong>
              liberar los patrones que te limitan y transformar tu realidad desde el plano cuántico, creando una nueva frecuencia de conciencia que te permita
              <strong>vivir en plenitud y realización.</strong>
            </p>
          </div>
          
        </div>
      </div>
    </section>
  )
}

