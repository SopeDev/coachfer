'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './Footer.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Footer() {
  const footerRef = useRef(null)
  const starsRef = useRef(null)
  const starsArrayRef = useRef([])

  useGSAP(() => {
    if (starsRef.current && footerRef.current) {
      const starsContainer = starsRef.current
      const starCount = 50
      const stars = []

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.className = 'footer__star'

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
        star.style.transform = 'translateZ(0)'

        starsContainer.appendChild(star)
        stars.push(star)
      }

      starsArrayRef.current = stars

      requestAnimationFrame(() => {
        if (!footerRef.current) return

        const footerHeight = footerRef.current.offsetHeight || 400

        stars.forEach((star) => {
          const parallaxSpeed = 0.3 + Math.random() * 1.2
          const movementY = footerHeight * 0.3 * parallaxSpeed

          gsap.to(star, {
            y: -movementY,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
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
          <div className="footer__brand">
            <h3 className="footer__brand-name">Fernando Quintero</h3>
            <p className="footer__brand-tagline">Coach en Astrología Cuántica</p>
            <p className="footer__brand-description">
              Reprogramación Cuántica del Destino
            </p>
          </div>

          <div className="footer__links">
            <h4 className="footer__links-title">Navegación</h4>
            <ul className="footer__links-list">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/coaching">Coaching</Link></li>
              <li><Link href="/mastermind">Mastermind</Link></li>
              <li><Link href="/coaching#offer">Paquetes de coaching</Link></li>
            </ul>
          </div>

          <div className="footer__contact">
            <h4 className="footer__contact-title">Contacto</h4>
            <ul className="footer__contact-list">
              <li>
                <Link href="/coaching#offer" className="footer__cta-link">
                  Agenda tu proceso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Fernando Quintero. Todos los derechos reservados.
          </p>
          <p className="footer__disclaimer">
            AstroHacking® es un método de transformación energética y cuántica.
          </p>
        </div>
      </div>
    </footer>
  )
}
