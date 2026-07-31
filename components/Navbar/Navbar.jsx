'use client'

import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AuthNavButton } from '../StartInterestButton/StartInterestButton'
import './Navbar.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Navbar() {
  const pathname = usePathname()
  const navbarRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuContentRef = useRef(null)
  const hamburgerRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isHome = pathname === '/'
  const isCoaching = pathname === '/coaching'
  const isMastermind = pathname === '/mastermind'

  useGSAP(() => {
    const heroContent = document.querySelector('.hero__content')
    if (!heroContent || !navbarRef.current) return

    const navbarHeight = navbarRef.current.offsetHeight

    const checkOverlap = () => {
      const heroContentRect = heroContent.getBoundingClientRect()
      setIsScrolled(heroContentRect.top <= navbarHeight)
    }

    requestAnimationFrame(checkOverlap)

    ScrollTrigger.create({
      trigger: heroContent,
      start: `top -${navbarHeight}px`,
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
      onUpdate: checkOverlap
    })

    const handleScroll = () => {
      checkOverlap()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, { scope: navbarRef, dependencies: [pathname] })

  useGSAP(() => {
    if (!mobileMenuRef.current || !mobileMenuContentRef.current || !hamburgerRef.current) return

    if (isMobileMenuOpen) {
      gsap.set(mobileMenuRef.current, { display: 'flex' })

      gsap.fromTo(mobileMenuRef.current,
        { x: '100%', y: '-100%', opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      )

      gsap.fromTo(mobileMenuContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: 'power2.out' }
      )

      const links = mobileMenuContentRef.current.querySelectorAll('.navbar__mobile-links li')
      gsap.fromTo(links,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.25,
          stagger: 0.08,
          ease: 'power2.out'
        }
      )

      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(1)'), {
        rotation: 45,
        y: 8,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(2)'), {
        opacity: 0,
        duration: 0.2
      })
      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(3)'), {
        rotation: -45,
        y: -8,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        y: '-100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: 'none' })
        }
      })

      gsap.to(mobileMenuContentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: 'power2.in'
      })

      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(1)'), {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(2)'), {
        opacity: 1,
        duration: 0.2,
        delay: 0.1
      })
      gsap.to(hamburgerRef.current.querySelector('.navbar__hamburger-line:nth-child(3)'), {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, { scope: navbarRef, dependencies: [isMobileMenuOpen] })

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useGSAP(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'

      const handleResize = () => {
        if (window.innerWidth >= 1200) {
          setIsMobileMenuOpen(false)
        }
      }

      window.addEventListener('resize', handleResize)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('resize', handleResize)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, { scope: navbarRef, dependencies: [isMobileMenuOpen] })

  return (
    <>
      <nav ref={navbarRef} className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          <div className="navbar__left">
            <div className="navbar__name">Fernando Quintero</div>
            <div className="navbar__title">Coach en Astrología Cuántica</div>
          </div>

          <Link href="/" className="navbar__logo" onClick={closeMobileMenu}>
            <img
              src={isScrolled ? '/icon-white.svg' : '/icon.svg'}
              alt="AstroHacking"
            />
          </Link>

          <ul className="navbar__links">
            <li>
              <Link href="/" className={isHome ? 'navbar__link--active' : ''}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/coaching" className={isCoaching ? 'navbar__link--active' : ''}>
                Coaching
              </Link>
            </li>
            <li>
              <Link
                href="/mastermind"
                className={isMastermind ? 'navbar__link--active' : ''}
              >
                Mastermind
              </Link>
            </li>
            <li>
              <AuthNavButton className="navbar__cta-button" />
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

      <div
        ref={mobileMenuRef}
        className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}
        onClick={closeMobileMenu}
      >
        <div ref={mobileMenuContentRef} className="navbar__mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <ul className="navbar__mobile-links">
            <li>
              <Link href="/" onClick={closeMobileMenu}>Inicio</Link>
            </li>
            <li>
              <Link href="/coaching" onClick={closeMobileMenu}>Coaching</Link>
            </li>
            <li>
              <Link href="/mastermind" onClick={closeMobileMenu}>
                Mastermind
              </Link>
            </li>
            <li className="navbar__mobile-cta-wrapper">
              <AuthNavButton
                className="navbar__mobile-cta-button"
                onClick={closeMobileMenu}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
