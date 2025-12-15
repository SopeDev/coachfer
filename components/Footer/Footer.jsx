"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Footer.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Footer() {
  const footerRef = useRef(null)
  const starsRef = useRef(null)
  const starsArrayRef = useRef([])

  useGSAP(() => {
    // Create subtle stars for footer with parallax effect
    if (starsRef.current && footerRef.current) {
      const starsContainer = starsRef.current
      const starCount = 50 // Subtle stars for footer
      const stars = []

      // Create stars
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div")
        star.className = "footer__star"
        
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
        star.style.willChange = "transform, opacity"
        star.style.transform = "translateZ(0)"

        starsContainer.appendChild(star)
        stars.push(star)
      }

      starsArrayRef.current = stars

      // Apply parallax effect to ALL stars
      // Wait a frame to ensure DOM is ready
      requestAnimationFrame(() => {
        const footerHeight = footerRef.current.offsetHeight || 400

        stars.forEach((star) => {
          // Different parallax speeds: from 0.3 to 1.5 (subtle range for footer)
          const parallaxSpeed = 0.3 + (Math.random() * 1.2) // Range: 0.3 to 1.5
          
          // Calculate movement based on footer height - subtle intensity
          const movementY = footerHeight * 0.3 * parallaxSpeed
          
          // Parallax animation with ScrollTrigger - using force3D for hardware acceleration
          gsap.to(star, {
            y: -movementY, // Move up as user scrolls down, back as scroll up
            ease: "none",
            force3D: true, // Force hardware acceleration
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1, // Smooth scrubbing - automatically bidirectional
              invalidateOnRefresh: true
            }
          })
        })
      })
    }
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="footer">
      <div ref={starsRef} className="footer__stars-container"></div>
      <div className="footer__glow"></div>
      
      <div className="footer__container">
        <div className="footer__content">
          {/* Logo/Brand Section */}
          <div className="footer__brand">
            <h3 className="footer__brand-name">Fernando Quintero</h3>
            <p className="footer__brand-tagline">Coach en Astrología Cuántica</p>
            <p className="footer__brand-description">
              Reprogramación Cuántica del Destino
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__links">
            <h4 className="footer__links-title">Navegación</h4>
            <ul className="footer__links-list">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#sobre">Sobre Fernando</a></li>
              <li><a href="#metodo">El Método</a></li>
              <li><a href="#benefits">Beneficios</a></li>
              <li><a href="#offer">Paquetes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4 className="footer__contact-title">Contacto</h4>
            <ul className="footer__contact-list">
              <li>
                <a href="/agendar" className="footer__cta-link">
                  Agenda tu proceso
                </a>
              </li>
              {/* Add email/phone if available */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Fernando Quintero. Todos los derechos reservados.
          </p>
          <p className="footer__disclaimer">
            AstroHacking es un método de transformación energética y cuántica.
          </p>
        </div>
      </div>
    </footer>
  )
}

