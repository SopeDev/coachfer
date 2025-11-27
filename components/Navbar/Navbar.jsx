"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Button from "../Button/Button"
import "./Navbar.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Navbar() {
  const navbarRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useGSAP(() => {
    const heroContent = document.querySelector('.hero__content')
    if (!heroContent || !navbarRef.current) return

    // Get navbar height
    const navbarHeight = navbarRef.current.offsetHeight

    // Function to check if navbar overlaps with hero__content
    const checkOverlap = () => {
      const heroContentRect = heroContent.getBoundingClientRect()
      // Check if navbar bottom (navbarHeight from top) overlaps with hero__content top
      setIsScrolled(heroContentRect.top <= navbarHeight)
    }

    // Initial check
    requestAnimationFrame(checkOverlap)

    // Create ScrollTrigger that updates on scroll
    ScrollTrigger.create({
      trigger: heroContent,
      start: `top -${navbarHeight}px`,
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
      onUpdate: checkOverlap
    })

    // Listen to scroll for real-time updates
    const handleScroll = () => {
      checkOverlap()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, { scope: navbarRef })

  return (
    <nav ref={navbarRef} className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <div className="navbar__left">
          <div className="navbar__name">Fernando Quintero</div>
          <div className="navbar__title">Coach en Astrología Cuántica</div>
        </div>
        
        <a href="#inicio" className="navbar__logo">
          <img
            src={isScrolled ? "/icon-white.svg" : "/icon.svg"}
            alt="Fernando Quintero"
          />
        </a>
        
        <ul className="navbar__links">
          <li><a href="#sobre">Sobre Fernando</a></li>
          <li><a href="#metodo">El Método</a></li>
          <li>
            <Button
              type="secondary"
              href="#agendar"
              className="navbar__cta-button"
            >
              Agendar
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

