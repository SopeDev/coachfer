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
  const mobileMenuRef = useRef(null)
  const mobileMenuContentRef = useRef(null)
  const hamburgerRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Mobile menu animation - translate from top-right
  useGSAP(() => {
    if (!mobileMenuRef.current || !mobileMenuContentRef.current || !hamburgerRef.current) return

    if (isMobileMenuOpen) {
      // Show menu
      gsap.set(mobileMenuRef.current, { display: "flex" })
      
      // Animate menu from top-right to center
      gsap.fromTo(mobileMenuRef.current,
        { 
          x: "100%",
          y: "-100%",
          opacity: 0
        },
        { 
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }
      )
      
      // Fade in content with slight delay
      gsap.fromTo(mobileMenuContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: "power2.out" }
      )
      
      // Animate links with stagger
      const links = mobileMenuContentRef.current.querySelectorAll(".navbar__mobile-links li")
      gsap.fromTo(links,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          delay: 0.25,
          stagger: 0.08,
          ease: "power2.out" 
        }
      )
      
      // Animate hamburger to X
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(1)"), {
        rotation: 45,
        y: 8,
        duration: 0.3,
        ease: "power2.out"
      })
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(2)"), {
        opacity: 0,
        duration: 0.2
      })
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(3)"), {
        rotation: -45,
        y: -8,
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      // Animate menu close - translate back to top-right
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        y: "-100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: "none" })
        }
      })
      
      // Fade out content
      gsap.to(mobileMenuContentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: "power2.in"
      })
      
      // Reset hamburger
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(1)"), {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(2)"), {
        opacity: 1,
        duration: 0.2,
        delay: 0.1
      })
      gsap.to(hamburgerRef.current.querySelector(".navbar__hamburger-line:nth-child(3)"), {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, { scope: navbarRef, dependencies: [isMobileMenuOpen] })

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Lock body scroll when mobile menu is open and handle resize
  useGSAP(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      
      // Close menu if window is resized to desktop size
      const handleResize = () => {
        if (window.innerWidth >= 1200) {
          setIsMobileMenuOpen(false)
        }
      }
      
      window.addEventListener('resize', handleResize)
      return () => {
        document.body.style.overflow = ""
        window.removeEventListener('resize', handleResize)
      }
    } else {
      document.body.style.overflow = ""
    }
  }, { scope: navbarRef, dependencies: [isMobileMenuOpen] })

  return (
    <>
      <nav ref={navbarRef} className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container">
          <div className="navbar__left">
            <div className="navbar__name">Fernando Quintero</div>
            <div className="navbar__title">Coach en Astrología Cuántica</div>
          </div>
          
          <a href="#inicio" className="navbar__logo" onClick={closeMobileMenu}>
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
                href="/agendar"
                className="navbar__cta-button"
              >
                Agendar
              </Button>
            </li>
          </ul>

          <button 
            ref={hamburgerRef}
            className="navbar__hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="navbar__hamburger-line"></span>
            <span className="navbar__hamburger-line"></span>
            <span className="navbar__hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Full Screen */}
      <div 
        ref={mobileMenuRef}
        className={`navbar__mobile-menu ${isMobileMenuOpen ? "navbar__mobile-menu--open" : ""}`}
        onClick={closeMobileMenu}
      >
        <div ref={mobileMenuContentRef} className="navbar__mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <ul className="navbar__mobile-links">
            <li>
              <a href="#sobre" onClick={closeMobileMenu}>Sobre Fernando</a>
            </li>
            <li>
              <a href="#metodo" onClick={closeMobileMenu}>El Método</a>
            </li>
            <li className="navbar__mobile-cta-wrapper">
              <Button
                type="secondary"
                href="/agendar"
                className="navbar__mobile-cta-button"
                onClick={closeMobileMenu}
              >
                Agendar
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

